package com.LilawatTechBlog.Services.impl;

import com.LilawatTechBlog.Services.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;


    @Async
    @Override
    public void sendOtpEmail(String email, String otp) {
        try
        {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("Your OTP - LilawatTechBlog");
            helper.setText(buildEmailTemplate(otp), true);
            mailSender.send(message);
        }catch (Exception e) {
            throw new RuntimeException("Failed to send email : " + e.getMessage());
        }
    }
    private String buildEmailTemplate(String otp) {
        return """
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Your OTP for LilawatTechBlog registration is:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px;">
                        <h1 style="color: #007bff; letter-spacing: 8px;">%s</h1>
                    </div>
                    <p style="color: #666;">This OTP will expire in <strong>5 minutes</strong>.</p>
                    <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                </div>
                """.formatted(otp);
    }
}
