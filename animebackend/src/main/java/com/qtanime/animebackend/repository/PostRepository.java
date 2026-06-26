package com.qtanime.animebackend.repository;

import com.qtanime.animebackend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}