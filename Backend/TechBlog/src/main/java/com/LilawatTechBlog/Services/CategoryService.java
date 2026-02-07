package com.LilawatTechBlog.Services;

import com.LilawatTechBlog.domain.entity.Category;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    List<Category> listCategories();
    Category CreateCategory(Category category);
    void deleteCategory(UUID id);
    Category getCategoryById(UUID id);
}
