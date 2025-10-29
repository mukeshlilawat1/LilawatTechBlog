package com.lilawattechblog.LilawatTechBlog.Domain.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Data
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

    @Column(nullable = false)
    private LocalDateTime createdAt;


    @Override
    public boolean equals(Object o) {
        if (this == o) return  true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User)o;
        return Objects.equals(id,  user.id) && Objects.equals(email, user.email) && Objects.equals(password, user.password) && Objects.equals(name, user.name) && Objects.equals(createdAt, user.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email, password, name, createdAt);
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
