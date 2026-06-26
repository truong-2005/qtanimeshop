package com.qtanime.animebackend.dto.product;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ProductSaleRequest {

    private Double salePrice;

    private Integer salePercent;

    private LocalDateTime startDate;

    private LocalDateTime endDate;
}