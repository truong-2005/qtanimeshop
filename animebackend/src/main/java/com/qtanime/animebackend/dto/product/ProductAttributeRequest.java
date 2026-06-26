package com.qtanime.animebackend.dto.product;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductAttributeRequest {

    @NotBlank(message = "Tên thuộc tính không được để trống")
    private String name;

    @NotBlank(message = "Giá trị thuộc tính không được để trống")
    private String value;
}