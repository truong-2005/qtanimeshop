package com.qtanime.animebackend.dto.review;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private Long id;

    private String username;

    private Long productId;

    private Integer rating;

    private String content;

    private String createdAt;
}