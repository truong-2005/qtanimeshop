package com.qtanime.animebackend.dto.product;

import lombok.Data;

@Data
public class ProductFilterRequest {

    private String keyword;

    private Long categoryId;

    private Long brandId;

    private Double minPrice;

    private Double maxPrice;

    private Integer page = 0;

    private Integer size = 10;

    private String sortBy = "createdAt";

    private String sortDirection = "desc";
}