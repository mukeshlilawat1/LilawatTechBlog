package com.LilawatTechBlog.mappers;

import com.LilawatTechBlog.domain.CreatePostRequest;
import com.LilawatTechBlog.domain.UpdatePostRequest;
import com.LilawatTechBlog.domain.dto.CreatePostRequestDto;
import com.LilawatTechBlog.domain.dto.PostDto;
import com.LilawatTechBlog.domain.dto.UpdatePostRequestDto;
import com.LilawatTechBlog.domain.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PostMapper {

    @Mapping(target = "author", source = "author")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "tags", source = "tags")
    PostDto toDto(Post post);

    // 🔥 THIS LINE FIXES EVERYTHING
    @Mapping(target = "status", source = "status")
    CreatePostRequest toCreatePostRequest(CreatePostRequestDto dto);


    UpdatePostRequest toUpdatePostRequest(UpdatePostRequestDto dto);
}

