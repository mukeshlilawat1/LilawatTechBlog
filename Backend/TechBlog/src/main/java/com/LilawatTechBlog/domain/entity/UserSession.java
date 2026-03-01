package com.LilawatTechBlog.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_sessions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String deviceInfo;

    @Column(nullable = false)
    private String ipAddress;

    @Column(nullable = false)
    private String refreshToken;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime lastActiveAt;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.lastActiveAt = LocalDateTime.now();
    }


}
