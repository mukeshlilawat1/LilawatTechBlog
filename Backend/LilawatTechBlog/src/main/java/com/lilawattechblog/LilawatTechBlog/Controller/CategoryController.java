package com.lilawattechblog.LilawatTechBlog.Controller;

import com.lilawattechblog.LilawatTechBlog.Domain.Dtos.CategoryDto;
import com.lilawattechblog.LilawatTechBlog.Domain.Entities.Category;
import com.lilawattechblog.LilawatTechBlog.Services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/categories")
@RequiredArgsConstructor

public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> listCategories() {
        //TODO
        List<Category> categories = categoryService.listCategories();
        return categories;

    }
}
