package com.qtanime.animebackend.dto.comment;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentReplyResponse {

    private Long id;

    private String username;

    private Long commentId;

    private String content;

    private String createdAt;
}