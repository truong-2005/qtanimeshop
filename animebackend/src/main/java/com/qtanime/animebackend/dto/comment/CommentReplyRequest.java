package com.qtanime.animebackend.dto.comment;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentReplyRequest {

    private Long commentId;

    @NotBlank
    private String content;
}