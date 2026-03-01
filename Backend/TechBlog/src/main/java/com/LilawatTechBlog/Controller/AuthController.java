package com.LilawatTechBlog.Controller;

import com.LilawatTechBlog.Services.AuthenticationService;
import com.LilawatTechBlog.Services.OtpService;
import com.LilawatTechBlog.domain.dto.*;
import com.LilawatTechBlog.domain.entity.User;
import com.LilawatTechBlog.exception.TwoFactorRequiredException;
import com.LilawatTechBlog.repository.RefreshTokenRepository;
import com.LilawatTechBlog.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final OtpService otpService;
    private final UserDetailsService userDetailsService;
    private final RefreshTokenRepository refreshTokenRepository;

    // ✅ Login — with lockout error handling
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            UserDetails userDetails = authenticationService
                    .authenticate(loginRequest.getEmail(), loginRequest.getPassword());

            String deviceInfo = request.getHeader("User-Agent") != null ?
                    request.getHeader("User-Agent") : "Unknown Device";

            String ipAddress = request.getRemoteAddr();

            AuthResponse response = buildAuthResponse(userDetails, loginRequest.getEmail());

            authenticationService.createSession(loginRequest.getEmail(),
                    response.getRefreshToken(),
                    deviceInfo,
                    ipAddress);

           return ResponseEntity.ok(response);
        }catch (TwoFactorRequiredException e) {
            otpService.generateAndSendOtp(e.getEmail());
            return ResponseEntity.ok(AuthResponse.builder()
                    .twoFactorRequired(true)
                    .name(e.getEmail())
                    .build());
        }

        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/2fa/verify")
    public ResponseEntity<?> verifyTwoFactor(@RequestBody TwoFactorRequest request,
                                             HttpServletRequest httpServletRequest) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
        if (!isValid) {
            return ResponseEntity.badRequest().body("Invalid or expired otp.");
        }
        otpService.deleteOtp(request.getEmail());

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        AuthResponse response = buildAuthResponse(userDetails, request.getEmail());

        String deviceInfo = httpServletRequest.getHeader("User-Agent") != null ?
                httpServletRequest.getHeader("User-Agent") : "Unknown Device";
        authenticationService.createSession(request.getEmail(),
                response.getRefreshToken(), deviceInfo, httpServletRequest.getRemoteAddr());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions")
    public ResponseEntity<?> getSessions(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = authenticationService.validateToken(token);
        return ResponseEntity.ok(authenticationService.getActiveSessions(userDetails.getUsername()));
    }


    @PostMapping("/2fa/enable")
    public ResponseEntity<?> enableTwoFactor(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = authenticationService.validateToken(token);
        authenticationService.enableTwoFactor(userDetails.getUsername());
        return ResponseEntity.ok("Two-Factor Authentication Enabled");
    }

    @PostMapping("/2fa/disable")
    public ResponseEntity<?> disableTwoFactor(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = authenticationService.validateToken(token);
        authenticationService.disableTwoFactor(userDetails.getUsername());
        return ResponseEntity.ok("Two-Factor Authentication Disabled");
    }

//    single session
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<?> revokeSession(@RequestHeader("Authorization") String authHeader,
                                           @PathVariable UUID sessionId) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = authenticationService.validateToken(token);
        authenticationService.revokeSession(userDetails.getUsername(), sessionId);
        return ResponseEntity.ok("Session has been revoked successfully");
    }


//    all session are revoke
    @PostMapping("/logout-all")
    public ResponseEntity<?> logoutAll(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer " , "");
        UserDetails userDetails = authenticationService.validateToken(token);
        authenticationService.revokeAllSessions(userDetails.getUsername());
        return ResponseEntity.ok("Logged out from all devices.");
    }

    // ✅ Step 1 — OTP bhejo
    @PostMapping("/register/send-otp")
    public ResponseEntity<String> sendOtp(@Valid @RequestBody OtpRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }
        otpService.generateAndSendOtp(request.getEmail());
        return ResponseEntity.ok("OTP sent to " + request.getEmail());
    }

    // ✅ Step 2 — OTP verify + account banao
    @PostMapping("/register/verify-otp")
    public ResponseEntity<?> verifyAndRegister(@Valid @RequestBody VerifyOtpRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
        if (!isValid) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP.");
        }

        UserDetails userDetails = authenticationService.register(request);
        otpService.deleteOtp(request.getEmail());

        return ResponseEntity.ok(buildAuthResponse(userDetails, request.getEmail()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isEmpty()) {
            return ResponseEntity.ok("If this email exists, otp has been sent.");
        }

        otpService.generateAndSendPasswordResetOtp(request.getEmail());
        return ResponseEntity.ok("If this email exists, otp has been sent successfully.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
        if (!isValid) {
            return ResponseEntity.badRequest().body("Invalid or Expired Otp");
        }
        authenticationService.resetPassword(request.getEmail(), request.getNewPassword());
        otpService.deleteOtp(request.getEmail());
        return ResponseEntity.ok("Password has been reset Successfully. please login again");
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = authenticationService.validateToken(token);
        authenticationService.changePassword(
                userDetails.getUsername(),
                request.getCurrentPassword(),
                request.getNewPassword()
        );
        return ResponseEntity.ok("Password has been changed successfully. please login again");
    }

    // ✅ Common helper
    private AuthResponse buildAuthResponse(UserDetails userDetails, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        String refreshToken = authenticationService.generateRefreshToken(email);
        return AuthResponse.builder()
                .token(authenticationService.generateToken(userDetails))
                .refreshToken(refreshToken)
                .expiresIn(900)
                .role(user.getRole().name())
                .name(user.getName())
                .userId(user.getId().toString())
                .build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest request) {
        try
        {
            String newRefreshToken = authenticationService.rotateRefreshToken(request.getRefreshToken());

            String email = refreshTokenRepository.findByTokenAndRevokedFalse(newRefreshToken)
                    .orElseThrow().getEmail();

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(authenticationService.generateToken(userDetails))
                    .refreshToken(newRefreshToken)
                    .expiresIn(900)
                    .build());
        }catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutRequest request) {
        authenticationService.revokeRefreshToken(request.getEmail());
        return ResponseEntity.ok("Logged out successfully.");
    }

}