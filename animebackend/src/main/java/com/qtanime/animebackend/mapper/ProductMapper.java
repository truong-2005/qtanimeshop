package com.qtanime.animebackend.mapper;

import org.springframework.stereotype.Component;

import com.qtanime.animebackend.dto.product.ProductResponse;
import com.qtanime.animebackend.entity.Product;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {

        if (product == null) {
            return null;
        }

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .thumbnail(product.getThumbnail())
                .categoryName(
                        product.getCategory() != null
                                ? product.getCategory().getName()
                                : null
                )
                .brandName(
                        product.getBrand() != null
                                ? product.getBrand().getName()
                                : null
                )
                .status(
                        product.getStatus() != null
                                ? product.getStatus().name()
                                : null
                )
                .build();
    }
}