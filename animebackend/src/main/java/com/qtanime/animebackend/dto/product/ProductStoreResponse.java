package com.qtanime.animebackend.dto.product;

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
public class ProductStoreResponse {

    private Long id;

    private Long productId;

    private String productName;

    private Integer importQuantity;

    private Integer currentQuantity;

    private Double importPrice;
}
