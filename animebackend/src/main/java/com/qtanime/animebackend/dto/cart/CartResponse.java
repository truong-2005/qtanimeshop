package com.qtanime.animebackend.dto.cart;

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
public class CartResponse {

    private Long cartItemId;

    private Long productId;

    private String productName;

    private String thumbnail;

    private Double price;

    private Integer quantity;

    private Double totalPrice;
}