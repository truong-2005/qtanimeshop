package com.qtanime.animebackend.service;

import java.util.List;

import com.qtanime.animebackend.dto.coupon.CouponApplyRequest;
import com.qtanime.animebackend.dto.coupon.CouponApplyResponse;
import com.qtanime.animebackend.dto.coupon.CouponRequest;
import com.qtanime.animebackend.dto.coupon.CouponResponse;
import com.qtanime.animebackend.entity.Coupon;

public interface CouponService {
    CouponResponse create(CouponRequest request);
    CouponResponse update(Long id, CouponRequest request);
    void delete(Long id);
    List<CouponResponse> getAll();
    CouponResponse getByCode(String code);
    Coupon getValidCouponByCode(String code, Double orderTotal);
    CouponApplyResponse applyCoupon(CouponApplyRequest request);
}
