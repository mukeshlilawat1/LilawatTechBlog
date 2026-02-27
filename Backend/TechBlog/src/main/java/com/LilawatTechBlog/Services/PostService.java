package com.LilawatTechBlog.Services;

import com.LilawatTechBlog.domain.CreatePostRequest;
import com.LilawatTechBlog.domain.UpdatePostRequest;
import com.LilawatTechBlog.domain.entity.Post;
import com.LilawatTechBlog.domain.entity.User;

import java.util.List;
import java.util.UUID;

public interface PostService {
    Post getPost(UUID id);
    List<Post> getAllPosts(UUID categoryId, UUID tagId);
    List<Post> getDraftPosts(User user);

    Post createPost(User user, CreatePostRequest createPostRequest);

    Post updatePost(UUID id, UpdatePostRequest updatePostRequest);

    void deletePost(UUID id);

    Post submitForReview(UUID id, User user);
    List<Post> getPendingPosts();
    Post approvePost(UUID postId);
    Post rejectPost(UUID postId, String message);
    List<Post> getUserPosts(User user);
}
