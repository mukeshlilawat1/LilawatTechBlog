package com.lilawattechblog.LilawatTechBlog.mappers;

import com.lilawattechblog.LilawatTechBlog.Domain.Dtos.CategoryDto;
import com.lilawattechblog.LilawatTechBlog.Domain.Entities.Category;
import com.lilawattechblog.LilawatTechBlog.Domain.Entities.Post;
import com.lilawattechblog.LilawatTechBlog.Domain.PostStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {
    @Mapping(target = "postCount", source = "posts", qualifiedByName = "calculatePostCount")
    CategoryDto toDto(Category category);

    @Named("calculatePostCount")
    default long  calculatePostCount(List<Post> posts) {
        if (null == posts) {
            return 0;
        }

     return posts.stream().filter(post -> PostStatus.PUBLISHED
                     .equals(post.getStatus()))
             .count();

    }
}
