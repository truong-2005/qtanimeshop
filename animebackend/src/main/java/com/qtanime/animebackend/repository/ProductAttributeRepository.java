package com.qtanime.animebackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qtanime.animebackend.entity.ProductAttribute;

public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, Long> {
}