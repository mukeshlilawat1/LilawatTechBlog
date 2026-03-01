package com.LilawatTechBlog.Services.impl;

import com.LilawatTechBlog.Services.AuthenticationService;
import com.LilawatTechBlog.domain.Role;
import com.LilawatTechBlog.domain.dto.RegisterRequest;
import com.LilawatTechBlog.domain.dto.SessionResponse;
import com.LilawatTechBlog.domain.entity.RefreshToken;
import com.LilawatTechBlog.domain.entity.User;
import com.LilawatTechBlog.domain.entity.UserSession;
import com.LilawatTechBlog.repository.RefreshTokenRepository;
import com.LilawatTechBlog.repository.UserRepository;
import com.LilawatTechBlog.repository.UserSessionRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserSessionRepository userSessionRepository;

    @Value("${jwt.secret}")
    private String secretKey;

    private final Long jwtExpiryMs = 86400000L;

    @Override
    public UserDetails authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (user.isAccountLocked()) {
            if (user.getLockedUntil() != null && LocalDateTime.now().isAfter(user.getLockedUntil())) {
                user.setAccountLocked(false);
                user.setFailedLoginAttempts(0);
                user.setLockedUntil(null);
                userRepository.save(user);
            } else {
                throw new RuntimeException("Account locked. Try again after 15 minutes.");
            }
        }

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (Exception e) {
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);

            if (user.getFailedLoginAttempts() >= 5) {
                user.setAccountLocked(true);
                user.setLockedUntil(LocalDateTime.now().plusMinutes(15));
                userRepository.save(user);
                throw new RuntimeException("Account locked after 5 failed attempts. Try again after 15 minutes.");
            }

            userRepository.save(user);
            throw new RuntimeException("Invalid password. Attempts left: " + (5 - user.getFailedLoginAttempts()));
        }

        user.setFailedLoginAttempts(0);
        user.setAccountLocked(false);
        user.setLockedUntil(null);
        userRepository.save(user);

        if (user.isTwoFactorEnabled()) {
            throw new RuntimeException(email);
        }

        return userDetailsService.loadUserByUsername(email);
    }

    @Override
    public UserDetails register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException(("Email already exists"));
        }

        User newUser = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(newUser);
        return userDetailsService.loadUserByUsername(newUser.getEmail());
    }

    @Override
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiryMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public UserDetails validateToken(String token) {
        String username = extractUsername(token);
        return userDetailsService.loadUserByUsername(username);
    }

    @Transactional
    @Override
    public String generateRefreshToken(String email) {
        refreshTokenRepository.deleteAllByEmail(email);

        String token = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .email(email)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
        return token;
    }

    @Override
    public String rotateRefreshToken(String refreshToken) {
        RefreshToken existing = refreshTokenRepository
                .findByTokenAndRevokedFalse(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid or expired refresh token"));

        if (existing.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(existing);
            throw new RuntimeException("Refresh Token expired. please login again");
        }

        existing.setRevoked(true);
        refreshTokenRepository.save(existing);

        return generateRefreshToken(existing.getEmail());
    }

    @Override
    public void revokeRefreshToken(String email) {
        refreshTokenRepository.deleteAllByEmail(email);
    }

    @Override
    @Transactional
    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setFailedLoginAttempts(0);
        user.setAccountLocked(false);
        user.setLockedUntil(null);
        userRepository.save(user);

        revokeRefreshToken(email);
    }

    @Override
    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found@"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect. Please try again");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        revokeRefreshToken(email);
    }

    @Override
    public String createSession(String email,
                                String refreshToken,
                                String deviceInfo,
                                String ipAddress) {
        UserSession session = UserSession.builder()
                .email(email)
                .refreshToken(refreshToken)
                .deviceInfo(deviceInfo)
                .ipAddress(ipAddress)
                .active(true)
                .build();

        userSessionRepository.save(session);
        return session.getId().toString();
    }

    @Override
    public List<SessionResponse> getActiveSessions(String email) {
        return userSessionRepository.findAllByEmailAndActiveTrue(email)
                .stream()
                .map(s -> SessionResponse.builder()
                        .sessionId(s.getId())
                        .deviceId(s.getDeviceInfo())
                        .ipAddress(s.getIpAddress())
                        .createdAt(s.getCreatedAt())
                        .lastActiveAt(s.getLastActiveAt())
                        .build()).toList();
    }

    @Override
    @Transactional
    public void revokeSession(String email, UUID sessionId) {
        UserSession session = userSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized access");
        }
        refreshTokenRepository.deleteAllByEmail(email);
        session.setActive(false);
        userSessionRepository.save(session);

    }

    @Override
    @Transactional
    public void revokeAllSessions(String email) {
        List<UserSession> sessions = userSessionRepository.findAllByEmailAndActiveTrue(email);
        sessions.forEach(s -> s.setActive(false));
        userSessionRepository.saveAll(sessions);
        refreshTokenRepository.deleteAllByEmail(email);

    }

    @Transactional
    @Override
    public void enableTwoFactor(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setTwoFactorEnabled(true);
        userRepository.save(user);
    }

    @Transactional
    @Override
    public void disableTwoFactor(String email) {
User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("user not found"));

user.setTwoFactorEnabled(false);
userRepository.save(user);
    }

    private String extractUsername(String token) {
        Claims claims = Jwts.parser().setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    private Key getSigningKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
