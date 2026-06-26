package com.qtanime.animebackend.service;

import com.qtanime.animebackend.dto.comment.*;

import java.util.List;

public interface CommentService {

    CommentResponse createComment(
            CommentRequest request,
            String email
    );

    CommentReplyResponse replyComment(
            CommentReplyRequest request,
            String email
    );

    List<CommentResponse> getCommentsByProduct(
            Long productId
    );
}