package com.qtanime.animebackend.dto.product;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;

    private String name;

    private String slug;

    private String description;

    private Double price;

    private Double salePrice;

    private Integer quantity;

    private String thumbnail;

    private String categoryName;

    private String brandName;

    private String status;

    private List<ProductImageDto> images;

    private List<ProductAttributeDto> attributes;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductAttributeDto {
        private Long id;
        private String name;
        private String value;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductImageDto {
        private Long id;
        private String imageUrl;
        private Boolean isPrimary;
    }
}