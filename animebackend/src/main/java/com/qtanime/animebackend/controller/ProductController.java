package com.qtanime.animebackend.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qtanime.animebackend.dto.product.ProductFilterRequest;
import com.qtanime.animebackend.dto.product.ProductRequest;
import com.qtanime.animebackend.dto.product.ProductResponse;
import com.qtanime.animebackend.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    // =========================
    // CLIENT
    // =========================

    @GetMapping
    public Page<ProductResponse> getAll(
            ProductFilterRequest request
    ) {

        return productService.getAll(request);
    }

    @GetMapping("/{id}")
    public ProductResponse getById(
            @PathVariable Long id
    ) {

        return productService.getById(id);
    }

    @GetMapping("/slug/{slug}")
    public ProductResponse getBySlug(
            @PathVariable String slug
    ) {

        return productService.getBySlug(slug);
    }

    // =========================
    // ADMIN
    // =========================

    @PostMapping(
            consumes = "multipart/form-data"
    )
    public ProductResponse create(
            @Valid
            @ModelAttribute ProductRequest request
    ) {

        return productService.create(request);
    }

    @PutMapping(
            value = "/{id}",
            consumes = "multipart/form-data"
    )
    public ProductResponse update(
            @PathVariable Long id,

            @Valid
            @ModelAttribute ProductRequest request
    ) {

        return productService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {

        productService.delete(id);
    }
}