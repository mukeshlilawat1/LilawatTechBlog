package com.LilawatTechBlog.Services.impl;

import com.LilawatTechBlog.Services.CategoryService;
import com.LilawatTechBlog.Services.PostService;
import com.LilawatTechBlog.Services.TagService;
import com.LilawatTechBlog.domain.CreatePostRequest;
import com.LilawatTechBlog.domain.PostStatus;
import com.LilawatTechBlog.domain.UpdatePostRequest;
import com.LilawatTechBlog.domain.entity.Category;
import com.LilawatTechBlog.domain.entity.Post;
import com.LilawatTechBlog.domain.entity.Tag;
import com.LilawatTechBlog.domain.entity.User;
import com.LilawatTechBlog.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CategoryService categoryService;
    private final TagService tagService;
    private static final int WORDS_PER_MINUTE = 200;

    @Override
    public Post getPost(UUID id) {
      return   postRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Post does not exist with id " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getAllPosts(UUID categoryId, UUID tagId) {
        if (categoryId != null && tagId != null) {
            Category category = categoryService.getCategoryById(categoryId);
            Tag tag = tagService.getTagById(tagId);
            return postRepository.findAllByStatusAndCategoryAndTagsContaining(
                    PostStatus.PUBLISHED,
                    category,
                    tag
            );

        }
        if (categoryId != null) {
            Category category = categoryService.getCategoryById(categoryId);
            return postRepository.findAllByStatusAndCategory(
                    PostStatus.PUBLISHED,
                    category
            );
        }
        if (tagId != null) {
            Tag tag = tagService.getTagById(tagId);
            return postRepository.findAllByStatusAndTagsContaining(
                    PostStatus.PUBLISHED,
                    tag
            );
        }
        return postRepository.findAllByStatus(PostStatus.PUBLISHED);
    }

    @Override
    public List<Post> getDraftPosts(User user) {
        return postRepository.findAllByAuthorAndStatus(user, PostStatus.DRAFT);
    }

    @Override
    @Transactional
    public Post createPost(User user, CreatePostRequest createPostRequest) {

        Post newPost = new Post();
        newPost.setTitle(createPostRequest.getTitle());
        newPost.setContent(createPostRequest.getContent());

        // 🔥 FIX HERE
        PostStatus status = createPostRequest.getStatus();
        if (status == null) {
            status = PostStatus.DRAFT;
        }
        newPost.setStatus(status);

        newPost.setAuthor(user);
        newPost.setReadingTime(calculateReadingTime(createPostRequest.getContent()));

        Category category = categoryService.getCategoryById(createPostRequest.getCategoryId());
        newPost.setCategory(category);

        Set<UUID> tagIds = createPostRequest.getTagIds();
        List<Tag> tags = tagService.getTagById(tagIds);
        newPost.setTags(new HashSet<>(tags));

        return postRepository.save(newPost);
    }

    @Override
    @Transactional
    public Post updatePost(UUID id, UpdatePostRequest updatePostRequest) {
       Post existingPost = postRepository.findById(id)
               .orElseThrow(() -> new EntityNotFoundException("Post does not exist with id " + id));

       existingPost.setTitle(updatePostRequest.getTitle());
       String postContent = updatePostRequest.getContent();
       existingPost.setContent(updatePostRequest.getContent());
       existingPost.setStatus(updatePostRequest.getStatus());
       existingPost.setReadingTime(calculateReadingTime(updatePostRequest.getContent()));

       UUID updatePostRequestCategoryId = updatePostRequest.getCategoryId();
       if (!existingPost.getCategory().getId().equals(updatePostRequestCategoryId)) {
         Category category =  categoryService.getCategoryById(updatePostRequestCategoryId);
          existingPost.setCategory(category);
       }
     Set<UUID> existingTagIds = existingPost.getTags().stream().map(Tag::getId).collect(Collectors.toSet());
      Set<UUID>updatePostRequestTagIds =  updatePostRequest.getTagIds();
      if (!existingTagIds.equals(updatePostRequestTagIds)) {
         List<Tag> newTags = tagService.getTagById(updatePostRequestTagIds);
         existingPost.setTags(new HashSet<>(newTags));
      }
      return postRepository.save(existingPost);
    }

    @Override
    public void deletePost(UUID id) {
     Post post = getPost(id);
     postRepository.delete(post);

    }


    private Integer calculateReadingTime(String content) {
        if (content == null || content.isEmpty()) {
            return 0;
        }

        int wordCount = content.trim().split("\\s+").length;
        return (int) Math.ceil((double) wordCount / WORDS_PER_MINUTE);
    }
}
