package com.qtanime.animebackend.service;

import org.springframework.data.domain.Page;

import com.qtanime.animebackend.dto.product.ProductAttributeRequest;
import com.qtanime.animebackend.dto.product.ProductFilterRequest;
import com.qtanime.animebackend.dto.product.ProductImageRequest;
import com.qtanime.animebackend.dto.product.ProductRequest;
import com.qtanime.animebackend.dto.product.ProductResponse;
import com.qtanime.animebackend.dto.product.ProductSaleRequest;
import com.qtanime.animebackend.dto.product.ProductVariantRequest;

public interface ProductService {

    // =========================
    // CLIENT
    // =========================

    Page<ProductResponse> getAll(ProductFilterRequest request);

    ProductResponse getById(Long id);

    ProductResponse getBySlug(String slug);

    // =========================
    // ADMIN
    // =========================

    ProductResponse create(ProductRequest request);

    ProductResponse update(Long id, ProductRequest request);

    void delete(Long id);

    // =========================
    // PRODUCT IMAGE
    // =========================

    void addImage(Long productId, ProductImageRequest request);

    void deleteImage(Long imageId);

    // =========================
    // PRODUCT ATTRIBUTE
    // =========================

    void addAttribute(Long productId, ProductAttributeRequest request);

    void deleteAttribute(Long attributeId);

    // =========================
    // PRODUCT VARIANT
    // =========================

    void addVariant(Long productId, ProductVariantRequest request);

    void deleteVariant(Long variantId);

    // =========================
    // PRODUCT SALE
    // =========================

    void createSale(Long productId, ProductSaleRequest request);

    void removeSale(Long productId);
}