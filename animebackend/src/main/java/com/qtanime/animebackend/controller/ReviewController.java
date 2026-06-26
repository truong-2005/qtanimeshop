package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.dto.common.ApiResponse;
import com.qtanime.animebackend.dto.review.ReviewRequest;
import com.qtanime.animebackend.dto.review.ReviewResponse;
import com.qtanime.animebackend.security.service.UserDetailsImpl;
import com.qtanime.animebackend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    // =========================================
    // CREATE REVIEW
    // =========================================

    @PostMapping
    public ApiResponse<ReviewResponse> createReview(

            @Valid
            @RequestBody
            ReviewRequest request,

            @AuthenticationPrincipal
            UserDetailsImpl userDetails
    ) {

        ReviewResponse response =
                reviewService.createReview(
                        request,
                        userDetails.getEmail()
                );

        return ApiResponse.<ReviewResponse>builder()
                .status(200)
                .message("Đánh giá sản phẩm thành công")
                .data(response)
                .build();
    }

    // =========================================
    // GET REVIEWS BY PRODUCT
    // =========================================

    @GetMapping("/product/{productId}")
    public ApiResponse<List<ReviewResponse>>
    getReviewsByProduct(

            @PathVariable
            Long productId
    ) {

        return ApiResponse
                .<List<ReviewResponse>>builder()
                .status(200)
                .message("Lấy danh sách đánh giá thành công")
                .data(
                        reviewService
                                .getReviewsByProduct(productId)
                )
                .build();
    }
}