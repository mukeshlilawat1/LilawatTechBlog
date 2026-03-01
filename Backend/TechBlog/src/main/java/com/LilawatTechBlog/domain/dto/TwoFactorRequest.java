package com.LilawatTechBlog.domain.dto;

import lombok.Getter;

@Getter
public class TwoFactorRequest {
    private String email;
    private String otp;
}
