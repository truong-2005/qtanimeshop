package com.qtanime.animebackend.service;

import java.util.List;

import com.qtanime.animebackend.entity.Category;

public interface CategoryService {

    List<Category> getAll();

    Category getById(Long id);

    Category create(Category category);

    Category update(Long id, Category category);

    void delete(Long id);
}