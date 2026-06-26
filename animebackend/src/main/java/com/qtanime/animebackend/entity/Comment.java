package com.qtanime.animebackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment extends BaseEntity {

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
    // CONTENT
    // =========================================

    @Column(columnDefinition = "TEXT")
    private String content;

    // =========================================
    // REPLIES
    // =========================================

    @OneToMany(
            mappedBy = "comment",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<CommentReply> replies;
}