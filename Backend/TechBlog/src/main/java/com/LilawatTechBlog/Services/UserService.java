package com.LilawatTechBlog.Services;

import com.LilawatTechBlog.domain.entity.User;

import java.util.UUID;

public interface UserService {
    User getUserById(UUID id);
}
