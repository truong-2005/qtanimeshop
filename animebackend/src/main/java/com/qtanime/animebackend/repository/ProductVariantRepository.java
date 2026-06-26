package com.qtanime.animebackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qtanime.animebackend.entity.ProductVariant;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    List<ProductVariant> findByProductId(Long productId);
}