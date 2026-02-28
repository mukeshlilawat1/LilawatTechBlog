package com.LilawatTechBlog.Services.impl;

import com.LilawatTechBlog.Services.EmailService;
import com.LilawatTechBlog.Services.OtpService;
import com.LilawatTechBlog.domain.entity.OtpVerification;
import com.LilawatTechBlog.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public void generateAndSendOtp(String email) {
        // ✅ Purane OTP delete karo + flush
        otpRepository.deleteAllByEmail(email);
        otpRepository.flush();

        String otp = String.format("%d", 100000 + new Random().nextInt(900000));

        OtpVerification otpVerification = OtpVerification.builder()
                .email(email)
                .otp(otp)
                .verified(false)
                .build();

        // ✅ saveAndFlush — immediately DB mein jaega
        otpRepository.saveAndFlush(otpVerification);

        // ✅ Debug log — console mein OTP dikhega
        System.out.println(">>> OTP SAVED: " + otp + " for email: " + email);

        // ✅ Email bhejo async
        emailService.sendOtpEmail(email, otp);
    }

    @Override
    @Transactional
    public boolean verifyOtp(String email, String otp) {
        Optional<OtpVerification> otpRecord =
                otpRepository.findByEmailAndOtpAndVerifiedFalse(email, otp);

        if (otpRecord.isEmpty()) {
            System.out.println(">>> OTP NOT FOUND for email: " + email + " otp: " + otp);
            return false;
        }

        OtpVerification record = otpRecord.get();

        // ✅ Expiry check
        if (record.getExpiresAt().isBefore(LocalDateTime.now())) {
            System.out.println(">>> OTP EXPIRED for email: " + email);
            otpRepository.delete(record);
            return false;
        }

        // ✅ Mark verified — delete baad mein register ke baad hoga
        record.setVerified(true);
        otpRepository.saveAndFlush(record);
        System.out.println(">>> OTP VERIFIED for email: " + email);
        return true;
    }

    @Override
    @Transactional
    public void deleteOtp(String email) {
        otpRepository.deleteAllByEmail(email);
        otpRepository.flush();
    }
}