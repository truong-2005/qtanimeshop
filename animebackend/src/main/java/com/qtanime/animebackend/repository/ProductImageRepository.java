package com.qtanime.animebackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qtanime.animebackend.entity.ProductImage;

public interface ProductImageRepository
        extends JpaRepository<ProductImage, Long> {
}