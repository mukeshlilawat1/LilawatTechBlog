package com.lilawattechblog.LilawatTechBlog.Services.impl;

import com.lilawattechblog.LilawatTechBlog.Domain.Entities.Category;
import com.lilawattechblog.LilawatTechBlog.Repositories.CategoryRepository;
import com.lilawattechblog.LilawatTechBlog.Services.CategoryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;


    @Override
    public List<Category> listCategories() {
        return categoryRepository.findAllWithPostCount();

    }

    @Override
    @Transactional
    public Category createCategory(Category category) {
        String categoryName = category.getName();
        if(categoryRepository.existsByIgnoreCaseName(categoryName)){
            throw new IllegalArgumentException("Category already exists with name: " + category.getName());
        }
        return categoryRepository.save(category);
    }
}
