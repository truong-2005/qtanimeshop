package com.qtanime.animebackend.dto.coupon;

import lombok.Data;

@Data
public class CouponApplyRequest {
    private String code;
    private Double totalOrderValue;
}
