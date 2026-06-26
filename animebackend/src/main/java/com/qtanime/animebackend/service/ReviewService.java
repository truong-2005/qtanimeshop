package com.qtanime.animebackend.service;

import com.qtanime.animebackend.dto.review.*;

import java.util.List;

public interface ReviewService {

    ReviewResponse createReview(
            ReviewRequest request,
            String email
    );

    List<ReviewResponse> getReviewsByProduct(
            Long productId
    );
}