package com.LilawatTechBlog.domain.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class ChangePasswordRequest {
    private String currentPassword;
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String newPassword;
}
