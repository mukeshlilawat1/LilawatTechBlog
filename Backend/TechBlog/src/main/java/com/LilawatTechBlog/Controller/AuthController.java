package com.LilawatTechBlog.Controller;

import com.LilawatTechBlog.Services.AuthenticationService;
import com.LilawatTechBlog.domain.dto.AuthResponse;
import com.LilawatTechBlog.domain.dto.LoginRequest;
import com.LilawatTechBlog.domain.dto.RegisterRequest;
import com.LilawatTechBlog.domain.entity.User;
import com.LilawatTechBlog.repository.UserRepository;
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

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        UserDetails userDetails = authenticationService
                .authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(buildAuthResponse(userDetails, loginRequest.getEmail()));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        UserDetails userDetails = authenticationService.register(request);
        return ResponseEntity.ok(buildAuthResponse(userDetails, request.getEmail()));
    }


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