package com.qtanime.animebackend.service;

import java.util.List;

import com.qtanime.animebackend.entity.Post;

public interface PostService {

    List<Post> getAll();

    Post getById(Long id);

    Post create(Post post);

    Post update(Long id, Post post);

    void delete(Long id);
}