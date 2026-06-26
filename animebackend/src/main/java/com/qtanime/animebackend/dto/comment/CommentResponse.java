package com.qtanime.animebackend.dto.comment;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {

    private Long id;

    private String username;

    private Long productId;

    private String content;

    private String createdAt;
}