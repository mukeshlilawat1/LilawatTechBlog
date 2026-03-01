package com.LilawatTechBlog.Security;

import com.LilawatTechBlog.Services.AuthenticationService;
import com.LilawatTechBlog.domain.Role;
import com.LilawatTechBlog.domain.entity.User;
import com.LilawatTechBlog.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;

    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(email)
                            .name(name)
                            .password("OAUTH2_USER")
                            .role(Role.USER)
                            .build();

                    return userRepository.save(newUser);
                });

        org.springframework.security.core.userdetails.UserDetails userDetails =
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build();

        String accessToken = authenticationService.generateToken(userDetails);
        String refreshToken = authenticationService.generateRefreshToken(email);

        String deviceInfo = request.getHeader("User-Agent") != null
                ? request.getHeader("User-Agent") :"Unknown Device";
        authenticationService.createSession(email, refreshToken, deviceInfo, request.getRemoteAddr());

//         frontend side redirect token ke sath
        String redirectUrl ="http://localhost:5173/oauth2/callback"
                + "?token=" + accessToken
                + "&refreshToken=" + refreshToken
                + "&role=" + user.getRole().name()
                + "&name=" + name;

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);

    }
}
