package com.LilawatTechBlog.Services;

public interface EmailService {
    void sendOtpEmail(String email, String otp);
    void sendPasswordResetEmail(String email, String otp);
}
