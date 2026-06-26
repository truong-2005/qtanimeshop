package com.qtanime.animebackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "comment_replies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentReply extends BaseEntity {

    // =========================================
    // COMMENT
    // =========================================

    @ManyToOne
    @JoinColumn(name = "comment_id")
    private Comment comment;

    // =========================================
    // USER
    // =========================================

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // =========================================
    // CONTENT
    // =========================================

    @Column(columnDefinition = "TEXT")
    private String content;
}