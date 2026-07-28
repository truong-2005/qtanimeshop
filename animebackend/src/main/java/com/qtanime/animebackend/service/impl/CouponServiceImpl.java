package com.qtanime.animebackend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.qtanime.animebackend.dto.coupon.CouponApplyRequest;
import com.qtanime.animebackend.dto.coupon.CouponApplyResponse;
import com.qtanime.animebackend.dto.coupon.CouponRequest;
import com.qtanime.animebackend.dto.coupon.CouponResponse;
import com.qtanime.animebackend.entity.Coupon;
import com.qtanime.animebackend.enums.DiscountType;
import com.qtanime.animebackend.exception.BadRequestException;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.CouponRepository;
import com.qtanime.animebackend.service.CouponService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;

    @Override
    @Transactional
    public CouponResponse create(CouponRequest request) {
        if (couponRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Mã giảm giá đã tồn tại");
        }
        Coupon coupon = mapToEntity(request, new Coupon());
        coupon = couponRepository.save(coupon);
        return mapToResponse(coupon);
    }

    @Override
    @Transactional
    public CouponResponse update(Long id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã giảm giá"));
        
        if (!coupon.getCode().equals(request.getCode()) && couponRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Mã giảm giá đã tồn tại");
        }

        coupon = mapToEntity(request, coupon);
        coupon = couponRepository.save(coupon);
        return mapToResponse(coupon);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã giảm giá"));
        couponRepository.delete(coupon);
    }

    @Override
    public List<CouponResponse> getAll() {
        return couponRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CouponResponse getByCode(String code) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã giảm giá"));
        return mapToResponse(coupon);
    }

    @Override
    public Coupon getValidCouponByCode(String code, Double orderTotal) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã giảm giá"));

        if (!coupon.getActive()) {
            throw new BadRequestException("Mã giảm giá đã bị khóa");
        }
        if (coupon.getQuantity() != null && coupon.getUsedCount() >= coupon.getQuantity()) {
            throw new BadRequestException("Mã giảm giá đã hết lượt sử dụng");
        }
        LocalDateTime now = LocalDateTime.now();
        if (coupon.getStartDate() != null && now.isBefore(coupon.getStartDate())) {
            throw new BadRequestException("Mã giảm giá chưa đến thời gian sử dụng");
        }
        if (coupon.getEndDate() != null && now.isAfter(coupon.getEndDate())) {
            throw new BadRequestException("Mã giảm giá đã hết hạn");
        }
        if (coupon.getMinOrderValue() != null && orderTotal < coupon.getMinOrderValue()) {
            throw new BadRequestException("Đơn hàng chưa đạt giá trị tối thiểu " + coupon.getMinOrderValue() + "đ");
        }

        return coupon;
    }

    @Override
    public CouponApplyResponse applyCoupon(CouponApplyRequest request) {
        Double total = request.getTotalOrderValue();
        Coupon coupon = getValidCouponByCode(request.getCode(), total);

        Double discountAmount = 0.0;
        if (coupon.getDiscountType() == DiscountType.PERCENT) {
            discountAmount = total * (coupon.getDiscountValue() / 100.0);
        } else {
            discountAmount = coupon.getDiscountValue();
        }

        if (discountAmount > total) {
            discountAmount = total;
        }

        return CouponApplyResponse.builder()
                .code(coupon.getCode())
                .originalTotal(total)
                .discountAmount(discountAmount)
                .finalTotal(total - discountAmount)
                .message("Áp dụng mã giảm giá thành công")
                .build();
    }

    private Coupon mapToEntity(CouponRequest request, Coupon coupon) {
        coupon.setCode(request.getCode());
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinOrderValue(request.getMinOrderValue());
        coupon.setQuantity(request.getQuantity());
        if (request.getStartDate() != null) coupon.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) coupon.setEndDate(request.getEndDate());
        if (request.getActive() != null) coupon.setActive(request.getActive());
        return coupon;
    }

    private CouponResponse mapToResponse(Coupon coupon) {
        CouponResponse response = new CouponResponse();
        response.setId(coupon.getId());
        response.setCode(coupon.getCode());
        response.setDiscountType(coupon.getDiscountType());
        response.setDiscountValue(coupon.getDiscountValue());
        response.setMinOrderValue(coupon.getMinOrderValue());
        response.setQuantity(coupon.getQuantity());
        response.setUsedCount(coupon.getUsedCount());
        response.setStartDate(coupon.getStartDate());
        response.setEndDate(coupon.getEndDate());
        response.setActive(coupon.getActive());
        response.setCreatedAt(coupon.getCreatedAt());
        response.setUpdatedAt(coupon.getUpdatedAt());
        return response;
    }
}
