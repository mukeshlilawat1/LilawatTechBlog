package com.lilawattechblog.LilawatTechBlog.Services;

import com.lilawattechblog.LilawatTechBlog.Domain.Entities.Category;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    List<Category> listCategories();
    Category createCategory(Category category);
    void deleteCategory(UUID id);

}
