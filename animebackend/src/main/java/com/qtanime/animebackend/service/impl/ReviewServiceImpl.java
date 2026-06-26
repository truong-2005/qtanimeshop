package com.qtanime.animebackend.service.impl;

import com.qtanime.animebackend.dto.review.ReviewRequest;
import com.qtanime.animebackend.dto.review.ReviewResponse;
import com.qtanime.animebackend.entity.Product;
import com.qtanime.animebackend.entity.Review;
import com.qtanime.animebackend.entity.User;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.ProductRepository;
import com.qtanime.animebackend.repository.ReviewRepository;
import com.qtanime.animebackend.repository.UserRepository;
import com.qtanime.animebackend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    // =========================================
    // CREATE REVIEW
    // =========================================

    @Override
    public ReviewResponse createReview(
            ReviewRequest request,
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy user"
                        ));

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy sản phẩm"
                        ));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .content(request.getContent())
                .build();

        reviewRepository.save(review);

        return ReviewResponse.builder()
                .id(review.getId())
                .username(user.getUsername())
                .productId(product.getId())
                .rating(review.getRating())
                .content(review.getContent())
                .createdAt(
                        review.getCreatedAt().toString()
                )
                .build();
    }

    // =========================================
    // GET REVIEWS BY PRODUCT
    // =========================================

    @Override
    public List<ReviewResponse> getReviewsByProduct(
            Long productId
    ) {

        return reviewRepository
                .findByProductId(productId)
                .stream()
                .map(review ->

                        ReviewResponse.builder()
                                .id(review.getId())
                                .username(
                                        review.getUser()
                                                .getUsername()
                                )
                                .productId(
                                        review.getProduct()
                                                .getId()
                                )
                                .rating(review.getRating())
                                .content(review.getContent())
                                .createdAt(
                                        review.getCreatedAt()
                                                .toString()
                                )
                                .build()
                )
                .toList();
    }
}