package com.qtanime.animebackend.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequest {

    private Long productId;

    @Min(1)
    @Max(5)
    private Integer rating;

    @NotBlank
    private String content;
}