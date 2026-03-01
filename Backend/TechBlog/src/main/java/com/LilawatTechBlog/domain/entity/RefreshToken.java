package com.LilawatTechBlog.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.scheduling.annotation.Async;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean revoked = false;

}
