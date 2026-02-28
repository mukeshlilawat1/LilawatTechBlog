package com.LilawatTechBlog.config;

import com.LilawatTechBlog.repository.PostRepository;
import com.LilawatTechBlog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component("blogHealth")
@RequiredArgsConstructor
public class CustomHealthIndicator implements HealthIndicator {
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Override
    public Health health() {
       try {
           long userCount = userRepository.count();
           long postCount = postRepository.count();
           return Health.up().
                   withDetail("status", "Blog is running perfectly")
                   .withDetail("totalUsers", userCount)
                   .withDetail("totalPosts", postCount)
                   .withDetail("database", "Connected")
                   .build();
       }catch (Exception e) {
           return Health.down()
                   .withDetail("status", "Database connection failed")
                   .withDetail("error", e.getMessage())
                   .build();
       }
    }
}
