package com.qtanime.animebackend.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.qtanime.animebackend.dto.product.ProductStoreRequest;
import com.qtanime.animebackend.dto.product.ProductStoreResponse;
import com.qtanime.animebackend.entity.Product;
import com.qtanime.animebackend.entity.ProductStore;
import com.qtanime.animebackend.repository.ProductRepository;
import com.qtanime.animebackend.repository.ProductStoreRepository;
import com.qtanime.animebackend.service.ProductStoreService;
import com.qtanime.animebackend.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductStoreServiceImpl implements ProductStoreService {

    private final ProductStoreRepository productStoreRepository;
    private final ProductRepository productRepository;

    @Override
    public List<ProductStoreResponse> getAllStores() {
        return productStoreRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductStoreResponse getStoreByProductId(Long productId) {
        ProductStore store = productStoreRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kho cho sản phẩm: " + productId));
        return mapToResponse(store);
    }

    @Override
    public ProductStoreResponse addStock(ProductStoreRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

        ProductStore store = productStoreRepository.findByProductId(request.getProductId())
                .orElse(ProductStore.builder()
                        .product(product)
                        .importQuantity(0)
                        .currentQuantity(0)
                        .importPrice(0.0)
                        .build());

        store.setImportQuantity(store.getImportQuantity() + request.getQuantity());
        store.setCurrentQuantity(store.getCurrentQuantity() + request.getQuantity());
        store.setImportPrice(request.getImportPrice());
        
        product.setQuantity(product.getQuantity() + request.getQuantity());
        productRepository.save(product);
        
        return mapToResponse(productStoreRepository.save(store));
    }

    @Override
    public ProductStoreResponse updateStock(ProductStoreRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

        ProductStore store = productStoreRepository.findByProductId(request.getProductId())
                .orElse(ProductStore.builder()
                        .product(product)
                        .importQuantity(0)
                        .currentQuantity(0)
                        .importPrice(0.0)
                        .build());

        // Update product quantity by calculating difference
        int diff = request.getQuantity() - store.getCurrentQuantity();
        product.setQuantity(product.getQuantity() + diff);
        productRepository.save(product);

        store.setCurrentQuantity(request.getQuantity());
        store.setImportPrice(request.getImportPrice());
        
        return mapToResponse(productStoreRepository.save(store));
    }

    private ProductStoreResponse mapToResponse(ProductStore store) {
        return ProductStoreResponse.builder()
                .id(store.getId())
                .productId(store.getProduct().getId())
                .productName(store.getProduct().getName())
                .importQuantity(store.getImportQuantity())
                .currentQuantity(store.getCurrentQuantity())
                .importPrice(store.getImportPrice())
                .build();
    }
}
