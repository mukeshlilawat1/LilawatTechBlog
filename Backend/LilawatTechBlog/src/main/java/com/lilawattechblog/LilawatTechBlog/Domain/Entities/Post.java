package com.lilawattechblog.LilawatTechBlog.Domain.Entities;

import com.lilawattechblog.LilawatTechBlog.Domain.PostStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "posts")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PostStatus status;

    @Column(nullable = false)
    private Integer readingTime;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Post post = (Post) o;
        return Objects.equals(getId(), post.getId())
                && Objects.equals(getTitle(),
                post.getTitle()) && Objects.equals(getContent(),
                post.getContent()) && getStatus() == post.getStatus()
                && Objects.equals(getReadingTime(),
                post.getReadingTime()) && Objects.equals(getCreatedAt(),
                post.getCreatedAt()) && Objects.equals(getUpdatedAt(),
                post.getUpdatedAt()) && Objects.equals(getAuthor(),
                post.getAuthor());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(),
                getTitle(), getContent(), getStatus(),
                getReadingTime(), getCreatedAt(), getUpdatedAt(), getAuthor());
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
