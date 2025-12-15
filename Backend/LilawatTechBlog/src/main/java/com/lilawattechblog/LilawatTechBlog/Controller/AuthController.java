package com.lilawattechblog.LilawatTechBlog.Controller;


import com.lilawattechblog.LilawatTechBlog.Domain.Dtos.AuthResponse;
import com.lilawattechblog.LilawatTechBlog.Domain.Dtos.LoginRequest;
import com.lilawattechblog.LilawatTechBlog.Services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
     UserDetails userDetails = authenticationService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

     String tokenValue =  authenticationService.generateToken(userDetails);

     AuthResponse.AuthResponseBuilder authResponseBuilder = AuthResponse.builder().token(tokenValue).expiresIn(86400);
     return ResponseEntity.ok(authResponseBuilder.build());
    }
}
