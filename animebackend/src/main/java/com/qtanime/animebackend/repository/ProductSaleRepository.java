package com.qtanime.animebackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qtanime.animebackend.entity.ProductSale;

public interface ProductSaleRepository extends JpaRepository<ProductSale, Long> {

    Optional<ProductSale> findByProductId(Long productId);
}