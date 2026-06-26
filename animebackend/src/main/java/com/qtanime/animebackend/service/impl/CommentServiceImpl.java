package com.qtanime.animebackend.service.impl;

import com.qtanime.animebackend.dto.comment.*;
import com.qtanime.animebackend.entity.*;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.*;
import com.qtanime.animebackend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    private final CommentReplyRepository commentReplyRepository;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    // =========================================
    // CREATE COMMENT
    // =========================================

    @Override
    public CommentResponse createComment(
            CommentRequest request,
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy user"
                        ));

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy sản phẩm"
                        ));

        Comment comment = Comment.builder()
                .user(user)
                .product(product)
                .content(request.getContent())
                .build();

        commentRepository.save(comment);

        return CommentResponse.builder()
                .id(comment.getId())
                .username(user.getUsername())
                .productId(product.getId())
                .content(comment.getContent())
                .createdAt(
                        comment.getCreatedAt().toString()
                )
                .build();
    }

    // =========================================
    // REPLY COMMENT
    // =========================================

    @Override
    public CommentReplyResponse replyComment(
            CommentReplyRequest request,
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy user"
                        ));

        Comment comment = commentRepository
                .findById(request.getCommentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy comment"
                        ));

        CommentReply reply = CommentReply.builder()
                .comment(comment)
                .user(user)
                .content(request.getContent())
                .build();

        commentReplyRepository.save(reply);

        return CommentReplyResponse.builder()
                .id(reply.getId())
                .username(user.getUsername())
                .commentId(comment.getId())
                .content(reply.getContent())
                .createdAt(
                        reply.getCreatedAt().toString()
                )
                .build();
    }

    // =========================================
    // GET COMMENTS BY PRODUCT
    // =========================================

    @Override
    public List<CommentResponse> getCommentsByProduct(
            Long productId
    ) {

        return commentRepository
                .findByProductId(productId)
                .stream()
                .map(comment ->

                        CommentResponse.builder()
                                .id(comment.getId())
                                .username(
                                        comment.getUser()
                                                .getUsername()
                                )
                                .productId(
                                        comment.getProduct()
                                                .getId()
                                )
                                .content(comment.getContent())
                                .createdAt(
                                        comment.getCreatedAt()
                                                .toString()
                                )
                                .build()
                )
                .toList();
    }
}