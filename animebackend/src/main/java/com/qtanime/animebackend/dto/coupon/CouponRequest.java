package com.qtanime.animebackend.dto.coupon;

import java.time.LocalDateTime;

import com.qtanime.animebackend.enums.DiscountType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CouponRequest {
    @NotBlank(message = "Mã giảm giá không được để trống")
    private String code;

    @NotNull(message = "Loại giảm giá không được để trống")
    private DiscountType discountType;

    @NotNull(message = "Giá trị giảm không được để trống")
    private Double discountValue;

    private Double minOrderValue;
    private Integer quantity;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean active;
}
