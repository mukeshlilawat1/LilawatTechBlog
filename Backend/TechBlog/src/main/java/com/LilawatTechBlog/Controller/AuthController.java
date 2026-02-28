package com.LilawatTechBlog.Controller;

import com.LilawatTechBlog.Services.AuthenticationService;
import com.LilawatTechBlog.Services.OtpService;
import com.LilawatTechBlog.domain.dto.*;
import com.LilawatTechBlog.domain.entity.User;
import com.LilawatTechBlog.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final OtpService otpService;

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        UserDetails userDetails = authenticationService
                .authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(buildAuthResponse(userDetails, loginRequest.getEmail()));
    }

    // ✅ Step 1 — OTP bhejo
    @PostMapping("/register/send-otp")
    public ResponseEntity<String> sendOtp(@Valid @RequestBody OtpRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }
        otpService.generateAndSendOtp(request.getEmail());
        return ResponseEntity.ok("OTP sent to " + request.getEmail());
    }

    // ✅ Step 2 — OTP verify + account banao
    @PostMapping("/register/verify-otp")
    public ResponseEntity<?> verifyAndRegister(@Valid @RequestBody VerifyOtpRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
        if (!isValid) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP.");
        }

        // ✅ Account banao
        UserDetails userDetails = authenticationService.register(request);

        // ✅ Register ke baad OTP cleanup
        otpService.deleteOtp(request.getEmail());

        return ResponseEntity.ok(buildAuthResponse(userDetails, request.getEmail()));
    }

    // ✅ Common helper
    private AuthResponse buildAuthResponse(UserDetails userDetails, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return AuthResponse.builder()
                .token(authenticationService.generateToken(userDetails))
                .expiresIn(86400)
                .role(user.getRole().name())
                .name(user.getName())
                .build();
    }
}