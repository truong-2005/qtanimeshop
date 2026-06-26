package com.qtanime.animebackend.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductVariantRequest {

    @NotBlank(message = "Tên biến thể không được để trống")
    private String variantName;

    @NotNull(message = "Giá không được để trống")
    private Double price;

    @NotNull(message = "Số lượng không được để trống")
    private Integer quantity;
}