package com.LilawatTechBlog.config;

import com.LilawatTechBlog.Security.BlogUserDetailsService;
import com.LilawatTechBlog.Security.JwtAuthenticationFilter;
import com.LilawatTechBlog.Security.OAuth2LoginSuccessHandler;
import com.LilawatTechBlog.Services.AuthenticationService;
import com.LilawatTechBlog.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(AuthenticationService authenticationService) {
        return new JwtAuthenticationFilter(authenticationService);
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return new BlogUserDetailsService(userRepository);
    }

    @Bean
    public RateLimitingFilter rateLimitingFilter() {
        return new RateLimitingFilter();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://lilawat-tech-blog.vercel.app"   // ✅ VERCEL DOMAIN
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity httpSecurity,
            JwtAuthenticationFilter jwtAuthenticationFilter,
            RateLimitingFilter rateLimitingFilter,
            OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler
    ) throws Exception {
        httpSecurity
                // ✅ CORS enable kiya
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/v1/auth/register").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/v1/auth/register/send-otp").permitAll()    // ✅ ADD
                                .requestMatchers(HttpMethod.POST, "/api/v1/auth/register/verify-otp").permitAll()  // ✅ ADD
                                // ✅ Actuator — sirf health public, baaki admin only
                                .requestMatchers("/actuator/health").permitAll()
                                .requestMatchers("/actuator/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/v1/posts/drafts").authenticated()
                                .requestMatchers("/api/v1/notes/**").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/v1/auth/refresh").permitAll()  // ✅ ADD
                                .requestMatchers(HttpMethod.POST, "/api/v1/auth/logout").permitAll()   // ✅ ADD
                                .requestMatchers(HttpMethod.POST, "/api/v1/auth/forgot-password").permitAll()  // ✅
                                .requestMatchers(HttpMethod.POST, "/api/v1/auth/reset-password").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/auth/sessions").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/api/v1/auth/sessions/**").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/v1/auth/logout-all").authenticated()// ✅
                                .requestMatchers(HttpMethod.POST, "/api/v1/auth/2fa/verify").permitAll() // ✅
// change-password authenticated rehega — koi change nahi
                                .requestMatchers(HttpMethod.GET, "/api/v1/posts/my-posts").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/v1/posts/*/submit").authenticated()
                                .requestMatchers(HttpMethod.GET, "/api/v1/posts/pending").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/v1/posts/*/approve").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/v1/posts/*/reject").authenticated()
                                .requestMatchers(HttpMethod.GET, "/api/v1/posts/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/tags/**").permitAll()
                                .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                        .frameOptions(frame -> frame.deny())
                        .xssProtection(xss -> xss
                                .headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                        .contentSecurityPolicy(csp ->
                                csp.policyDirectives("default-src 'self'"))
                )
                .oauth2Login(oauth2 -> oauth2.successHandler(oAuth2LoginSuccessHandler))
                .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}