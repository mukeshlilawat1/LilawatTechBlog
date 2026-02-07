package com.LilawatTechBlog.repository;

import com.LilawatTechBlog.Services.PostService;
import com.LilawatTechBlog.domain.PostStatus;
import com.LilawatTechBlog.domain.entity.Category;
import com.LilawatTechBlog.domain.entity.Post;
import com.LilawatTechBlog.domain.entity.Tag;
import com.LilawatTechBlog.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    List<Post> findAllByStatusAndCategoryAndTagsContaining(PostStatus status, Category category, Tag tag);
    List<Post> findAllByStatusAndCategory(PostStatus status, Category category);
    List<Post> findAllByStatusAndTagsContaining(PostStatus postStatus, Tag tag);

    List<Post> findAllByStatus(PostStatus postStatus);
    List<Post>findAllByAuthorAndStatus(User author , PostStatus postStatus);

}
