package com.LilawatTechBlog.Services;

import com.LilawatTechBlog.domain.dto.RegisterRequest;
import com.LilawatTechBlog.domain.dto.SessionResponse;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.UUID;

public interface AuthenticationService {
    UserDetails authenticate(String email, String password);
    UserDetails register(RegisterRequest request);
    String generateToken(UserDetails userDetails);

    UserDetails validateToken(String token);

    String generateRefreshToken(String email);
    String rotateRefreshToken(String refreshToken);
    void revokeRefreshToken(String email);

    void resetPassword(String email, String newPassword);
    void changePassword(String email, String currentPassword, String newPassword);

//Session Management
    String createSession(String email, String refreshToken, String deviceInfo, String ipAddress);
    List<SessionResponse> getActiveSessions(String email);
    void revokeSession(String email, UUID sessionId);
    void revokeAllSessions(String email);

    void enableTwoFactor(String email);
    void disableTwoFactor(String email);
}
