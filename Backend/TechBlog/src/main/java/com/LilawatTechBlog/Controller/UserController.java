package com.LilawatTechBlog.Controller;

import com.LilawatTechBlog.domain.dto.UserProfileResponse;
import com.LilawatTechBlog.domain.entity.User;
import com.LilawatTechBlog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow();

        UserProfileResponse profile = UserProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .totalPosts(user.getPosts() != null ? user.getPosts().size() : 0) // ✅ null check
                .build();

        return ResponseEntity.ok(profile);
    }

}
