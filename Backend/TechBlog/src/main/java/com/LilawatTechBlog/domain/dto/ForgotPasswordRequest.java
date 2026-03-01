package com.LilawatTechBlog.domain.dto;

import jakarta.validation.constraints.Email;
import lombok.Getter;

@Getter
public class ForgotPasswordRequest {
    @Email
    private String email;
}
