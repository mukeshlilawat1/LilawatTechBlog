package com.LilawatTechBlog.domain.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class UserProfileResponse {
 private String id;
 private String name;
 private String email;
 private long totalPosts;
}
