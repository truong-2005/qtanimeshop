package com.qtanime.animebackend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.qtanime.animebackend.dto.product.ProductStoreRequest;
import com.qtanime.animebackend.dto.product.ProductStoreResponse;
import com.qtanime.animebackend.service.ProductStoreService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/product-store")
@RequiredArgsConstructor
public class ProductStoreController {

    private final ProductStoreService productStoreService;

    @GetMapping
    public ResponseEntity<List<ProductStoreResponse>> getAllStores() {
        return ResponseEntity.ok(productStoreService.getAllStores());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ProductStoreResponse> getStoreByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(productStoreService.getStoreByProductId(productId));
    }

    @PostMapping("/add")
    public ResponseEntity<ProductStoreResponse> addStock(@Valid @RequestBody ProductStoreRequest request) {
        return ResponseEntity.ok(productStoreService.addStock(request));
    }

    @PutMapping("/update")
    public ResponseEntity<ProductStoreResponse> updateStock(@Valid @RequestBody ProductStoreRequest request) {
        return ResponseEntity.ok(productStoreService.updateStock(request));
    }
}