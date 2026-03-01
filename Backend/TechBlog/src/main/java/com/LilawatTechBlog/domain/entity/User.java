package com.LilawatTechBlog.domain.entity;


import com.LilawatTechBlog.domain.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.USER;

    @Column(nullable = false)
    @Builder.Default
    private int failedLoginAttempts = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean accountLocked = false;

    @Column
    private LocalDateTime lockedUntil;

    @Column(nullable = false)
    @Builder.Default
    private boolean twoFactorEnabled = false;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(getId(), user.getId()) && Objects.equals(getEmail(), user.getEmail()) && Objects.equals(getPassword(), user.getPassword()) && Objects.equals(getName(), user.getName()) && Objects.equals(getCreatedAt(), user.getCreatedAt());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getEmail(), getPassword(), getName(), getCreatedAt());
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }


}
