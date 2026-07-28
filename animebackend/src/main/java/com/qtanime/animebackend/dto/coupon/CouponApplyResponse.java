package com.qtanime.animebackend.dto.coupon;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponApplyResponse {
    private String code;
    private Double originalTotal;
    private Double discountAmount;
    private Double finalTotal;
    private String message;
}
