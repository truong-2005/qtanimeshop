package com.qtanime.animebackend.repository;

import com.qtanime.animebackend.entity.CommentReply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentReplyRepository
        extends JpaRepository<CommentReply, Long> {

    List<CommentReply> findByCommentId(Long commentId);
}