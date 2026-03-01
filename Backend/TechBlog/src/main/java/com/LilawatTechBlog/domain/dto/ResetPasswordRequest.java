package com.LilawatTechBlog.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class ResetPasswordRequest {
    @Email
    private String email;
    private String otp;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String newPassword;
}
