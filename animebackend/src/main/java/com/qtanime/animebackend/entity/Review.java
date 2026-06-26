package com.qtanime.animebackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review extends BaseEntity {

    // =========================================
    // USER
    // =========================================

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // =========================================
    // PRODUCT
    // =========================================

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // =========================================
    // RATING
    // =========================================

    private Integer rating;

    // =========================================
    // CONTENT
    // =========================================

    @Column(columnDefinition = "TEXT")
    private String content;
}