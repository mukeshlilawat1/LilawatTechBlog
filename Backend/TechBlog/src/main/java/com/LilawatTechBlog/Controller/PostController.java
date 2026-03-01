package com.LilawatTechBlog.Controller;

import com.LilawatTechBlog.Services.PostService;
import com.LilawatTechBlog.Services.UserService;
import com.LilawatTechBlog.domain.CreatePostRequest;
import com.LilawatTechBlog.domain.UpdatePostRequest;
import com.LilawatTechBlog.domain.dto.CreatePostRequestDto;
import com.LilawatTechBlog.domain.dto.PostDto;
import com.LilawatTechBlog.domain.dto.UpdatePostRequestDto;
import com.LilawatTechBlog.domain.entity.Post;
import com.LilawatTechBlog.domain.entity.User;
import com.LilawatTechBlog.mappers.PostMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final PostMapper postMapper;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID tagId, Principal principal) {
        List<Post> posts = postService.getAllPosts(categoryId, tagId);
        List<PostDto> postDtos = posts.stream().map(postMapper::toDto).toList();
        return ResponseEntity.ok(postDtos);
    }

    @GetMapping(path = "/drafts")
    public ResponseEntity<List<PostDto>> getDrafts(@RequestAttribute UUID userId) {
        User loggedInUser = userService.getUserById(userId);

        List<Post> draftPosts = postService.getDraftPosts(loggedInUser);
        List<PostDto> postDtos = draftPosts.stream().map(postMapper::toDto).toList();

        return ResponseEntity.ok(postDtos);
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(
            @Valid @RequestBody CreatePostRequestDto createPostRequestDto,
            @RequestAttribute UUID userId
    ) {
        User loggedInUser = userService.getUserById(userId);
        CreatePostRequest createPostRequest = postMapper.toCreatePostRequest(createPostRequestDto);
        Post createdPost = postService.createPost(loggedInUser, createPostRequest);
        PostDto createdPostDto = postMapper.toDto(createdPost);

        return new ResponseEntity<>(createdPostDto, HttpStatus.CREATED);
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<PostDto> updatePost(
            @PathVariable UUID id, @Valid @RequestBody UpdatePostRequestDto updatePostRequestDto
    ) {
        UpdatePostRequest updatePostRequest = postMapper.toUpdatePostRequest(updatePostRequestDto);
        Post updatedPost = postService.updatePost(id, updatePostRequest);
        PostDto updatedPostDto = postMapper.toDto(updatedPost);
        return ResponseEntity.ok(updatedPostDto);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<PostDto> getPost(
            @PathVariable UUID id
    ) {
        Post post = postService.getPost(id);
        PostDto postDto = postMapper.toDto(post);

        return ResponseEntity.ok(postDto);

    }


    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable UUID id, @RequestAttribute UUID userId) throws AccessDeniedException {
       postService.deletePost(id, userId);
       return ResponseEntity.noContent().build();

    }

    @GetMapping("/my-posts")
    public ResponseEntity<List<PostDto>> getMyPosts(@RequestAttribute UUID userId) {
        User loggedInUser = userService.getUserById(userId);
        List<Post> posts = postService.getUserPosts(loggedInUser);
        List<PostDto> postDtos = posts.stream().map(postMapper::toDto).toList();
        return ResponseEntity.ok(postDtos);
    }


    @PostMapping("/{id}/submit")
    public ResponseEntity<PostDto> submitPost(
            @PathVariable UUID id,
            @RequestAttribute UUID userId
    ){
        User loggedInUser = userService.getUserById(userId);
        Post post = postService.submitForReview(id, loggedInUser);
        return ResponseEntity.ok(postMapper.toDto(post));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<PostDto>>getPendingPosts() {
        List<Post> pendingPosts = postService.getPendingPosts();
        List<PostDto> postDtos = pendingPosts.stream().map(postMapper::toDto).toList();
        return ResponseEntity.ok(postDtos);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<PostDto>approvePost(
            @PathVariable UUID id
    ) {
        Post post = postService.approvePost(id);
        return ResponseEntity.ok(postMapper.toDto(post));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<PostDto> rejectPost(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body
    ) {
        String message = body.get("message");
        Post post = postService.rejectPost(id, message);
        return ResponseEntity.ok(postMapper.toDto(post));
    }
}
