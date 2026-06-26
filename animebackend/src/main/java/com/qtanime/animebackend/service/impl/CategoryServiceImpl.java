package com.qtanime.animebackend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qtanime.animebackend.entity.Category;
import com.qtanime.animebackend.exception.BadRequestException;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.CategoryRepository;
import com.qtanime.animebackend.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAll() {

        return categoryRepository.findAll();
    }

    @Override
    public Category getById(Long id) {

        return categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category không tồn tại"));
    }

    @Override
    public Category create(Category category) {

        if (categoryRepository.existsByName(category.getName())) {
            throw new BadRequestException("Tên category đã tồn tại");
        }

        return categoryRepository.save(category);
    }

    @Override
    public Category update(Long id, Category category) {

        Category oldCategory = getById(id);

        oldCategory.setName(category.getName());

        return categoryRepository.save(oldCategory);
    }

    @Override
    public void delete(Long id) {

        Category category = getById(id);

        categoryRepository.delete(category);
    }
}