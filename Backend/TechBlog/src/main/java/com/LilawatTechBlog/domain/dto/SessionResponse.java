package com.LilawatTechBlog.domain.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class SessionResponse {
    private UUID sessionId;
    private String deviceId;
    private String ipAddress;
    private LocalDateTime createdAt;
    private LocalDateTime lastActiveAt;
}
