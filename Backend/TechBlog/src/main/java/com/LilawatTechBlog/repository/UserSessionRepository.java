package com.LilawatTechBlog.repository;

import com.LilawatTechBlog.domain.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, UUID> {
    List<UserSession> findAllByEmailAndActiveTrue(String email);
    Optional<UserSession> findByRefreshTokenAndActiveTrue(String refreshToken);
    void deleteAllByEmail(String email);
}
