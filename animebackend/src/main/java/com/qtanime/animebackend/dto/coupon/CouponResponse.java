package com.qtanime.animebackend.dto.coupon;

import java.time.LocalDateTime;

import com.qtanime.animebackend.enums.DiscountType;

import lombok.Data;

@Data
public class CouponResponse {
    private Long id;
    private String code;
    private DiscountType discountType;
    private Double discountValue;
    private Double minOrderValue;
    private Integer quantity;
    private Integer usedCount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
