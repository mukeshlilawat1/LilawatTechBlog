package com.LilawatTechBlog.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> apiBuckets = new ConcurrentHashMap<>();


    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();

    private Bucket createApiBucket() {
        Bandwidth limit = Bandwidth.classic(
                100,
                Refill.greedy(100, Duration.ofMinutes(1))
        );
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createLoginBucket() {

        Bandwidth limit = Bandwidth.classic(
                5,
                Refill.greedy(5, Duration.ofMinutes(1))
        );
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String ip = getClientIp(request);
        String uri = request.getRequestURI();

        if (uri.contains("/auth/login")) {
            Bucket loginBucket = loginBuckets.computeIfAbsent(ip, k -> createLoginBucket());

            if (!loginBucket.tryConsume(1)) {
                sendTooManyRequestsResponse(
                        response,
                        "Too many login attempts. Please try again after 1 minute.",
                        loginBucket
                );
                return;
            }
        }


        Bucket apiBucket = apiBuckets.computeIfAbsent(ip, k -> createApiBucket());

        if (apiBucket.tryConsume(1)) {
            response.setHeader("X-Rate-Limit-Remaining",
                    String.valueOf(apiBucket.getAvailableTokens()));
            filterChain.doFilter(request, response);
        } else {
            sendTooManyRequestsResponse(
                    response,
                    "Too many requests. Please try again after 1 minute.",
                    apiBucket
            );
        }
    }


    private void sendTooManyRequestsResponse(
            HttpServletResponse response,
            String message,
            Bucket bucket
    ) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader("X-Rate-Limit-Retry-After", "60");
        response.setHeader("X-Rate-Limit-Remaining", "0");

        new ObjectMapper().writeValue(response.getWriter(), Map.of(
                "status", 429,
                "error", "Too Many Requests",
                "message", message,
                "retryAfter", "60 seconds"
        ));
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}