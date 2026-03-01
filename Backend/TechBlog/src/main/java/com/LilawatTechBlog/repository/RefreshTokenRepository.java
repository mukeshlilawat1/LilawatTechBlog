package com.LilawatTechBlog.repository;

import com.LilawatTechBlog.domain.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByTokenAndRevokedFalse(String token);
    void deleteAllByEmail(String email);
}
