package com.lilawattechblog.LilawatTechBlog.Controller;

import com.lilawattechblog.LilawatTechBlog.Domain.Dtos.CategoryDto;
import com.lilawattechblog.LilawatTechBlog.Domain.Dtos.CreateCategoryRequest;
import com.lilawattechblog.LilawatTechBlog.Domain.Entities.Category;
import com.lilawattechblog.LilawatTechBlog.Services.CategoryService;
import com.lilawattechblog.LilawatTechBlog.mappers.CategoryMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> listCategories() {
        //TODO
        List<CategoryDto> categories = categoryService
                .listCategories()
                .stream()
                .map(categoryMapper::toDto).toList();

        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CreateCategoryRequest createCategoryRequest) {
        Category categoryToCreate = categoryMapper.toEntity(createCategoryRequest);
        Category savedCategory = categoryService.createCategory(categoryToCreate);
        return new ResponseEntity<>(
                categoryMapper.toDto(savedCategory),
                HttpStatus.CREATED
        );
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
          categoryService.deleteCategory(id);
          return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
