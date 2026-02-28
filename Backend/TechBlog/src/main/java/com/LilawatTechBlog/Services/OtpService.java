package com.LilawatTechBlog.Services;

public interface OtpService {
    void generateAndSendOtp(String email);
    boolean verifyOtp(String email, String otp);
    void deleteOtp(String email);
}
