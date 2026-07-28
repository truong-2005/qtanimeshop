package com.qtanime.animebackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qtanime.animebackend.dto.coupon.CouponApplyRequest;
import com.qtanime.animebackend.dto.coupon.CouponApplyResponse;
import com.qtanime.animebackend.dto.coupon.CouponRequest;
import com.qtanime.animebackend.dto.coupon.CouponResponse;
import com.qtanime.animebackend.service.CouponService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;

    @GetMapping
    public List<CouponResponse> getAll() {
        return couponService.getAll();
    }

    @GetMapping("/{code}")
    public CouponResponse getByCode(@PathVariable String code) {
        return couponService.getByCode(code);
    }

    @PostMapping
    public CouponResponse create(@Valid @RequestBody CouponRequest request) {
        return couponService.create(request);
    }

    @PutMapping("/{id}")
    public CouponResponse update(@PathVariable Long id, @Valid @RequestBody CouponRequest request) {
        return couponService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        couponService.delete(id);
    }

    @PostMapping("/apply")
    public CouponApplyResponse applyCoupon(@RequestBody CouponApplyRequest request) {
        return couponService.applyCoupon(request);
    }
}
