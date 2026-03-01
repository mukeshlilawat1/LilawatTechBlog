package com.LilawatTechBlog.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private long expiresIn;
    private String role;
    private String name;
    private boolean twoFactorRequired;
    private String userId;

}
