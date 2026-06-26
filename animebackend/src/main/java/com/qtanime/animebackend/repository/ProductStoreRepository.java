package com.qtanime.animebackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qtanime.animebackend.entity.ProductStore;

public interface ProductStoreRepository extends JpaRepository<ProductStore, Long> {

    Optional<ProductStore> findByProductId(Long productId);
}