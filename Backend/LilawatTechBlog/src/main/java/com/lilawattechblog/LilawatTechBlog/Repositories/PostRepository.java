package com.lilawattechblog.LilawatTechBlog.Repositories;

import com.lilawattechblog.LilawatTechBlog.Domain.Entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {

}
