package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.dto.comment.*;
import com.qtanime.animebackend.dto.common.ApiResponse;
import com.qtanime.animebackend.security.service.UserDetailsImpl;
import com.qtanime.animebackend.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    // =========================================
    // CREATE COMMENT
    // =========================================

    @PostMapping
    public ApiResponse<CommentResponse> createComment(

            @Valid
            @RequestBody
            CommentRequest request,

            @AuthenticationPrincipal
            UserDetailsImpl userDetails
    ) {

        CommentResponse response =
                commentService.createComment(
                        request,
                        userDetails.getEmail()
                );

        return ApiResponse.<CommentResponse>builder()
                .status(200)
                .message("Bình luận thành công")
                .data(response)
                .build();
    }

    // =========================================
    // REPLY COMMENT
    // =========================================

    @PostMapping("/reply")
    public ApiResponse<CommentReplyResponse> replyComment(

            @Valid
            @RequestBody
            CommentReplyRequest request,

            @AuthenticationPrincipal
            UserDetailsImpl userDetails
    ) {

        CommentReplyResponse response =
                commentService.replyComment(
                        request,
                        userDetails.getEmail()
                );

        return ApiResponse
                .<CommentReplyResponse>builder()
                .status(200)
                .message("Phản hồi bình luận thành công")
                .data(response)
                .build();
    }

    // =========================================
    // GET COMMENTS BY PRODUCT
    // =========================================

    @GetMapping("/product/{productId}")
    public ApiResponse<List<CommentResponse>>
    getCommentsByProduct(

            @PathVariable
            Long productId
    ) {

        return ApiResponse
                .<List<CommentResponse>>builder()
                .status(200)
                .message("Lấy danh sách bình luận thành công")
                .data(
                        commentService
                                .getCommentsByProduct(productId)
                )
                .build();
    }
}