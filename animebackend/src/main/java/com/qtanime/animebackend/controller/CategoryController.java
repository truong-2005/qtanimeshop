package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.entity.Category;
import com.qtanime.animebackend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<Category> getAll() {

        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) {

        return categoryService.getById(id);
    }

    @PostMapping
    public Category create(@RequestBody Category category) {

        return categoryService.create(category);
    }

    @PutMapping("/{id}")
    public Category update(
            @PathVariable Long id,
            @RequestBody Category category
    ) {

        return categoryService.update(id, category);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {

        categoryService.delete(id);
    }
}