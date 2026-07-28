package com.qtanime.animebackend.service;

import java.util.List;

import com.qtanime.animebackend.dto.product.ProductStoreRequest;
import com.qtanime.animebackend.dto.product.ProductStoreResponse;

public interface ProductStoreService {

    List<ProductStoreResponse> getAllStores();

    ProductStoreResponse getStoreByProductId(Long productId);

    ProductStoreResponse addStock(ProductStoreRequest request);

    ProductStoreResponse updateStock(ProductStoreRequest request);
}
