package com.qtanime.animebackend.dto.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartRequest {

    @NotNull(message = "Id sản phẩm không được để trống")
    private Long productId;

    @Min(value = 1, message = "Số lượng tối thiểu là 1")
    private Integer quantity;
}