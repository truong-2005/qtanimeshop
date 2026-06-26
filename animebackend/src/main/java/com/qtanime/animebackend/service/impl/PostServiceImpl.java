package com.qtanime.animebackend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qtanime.animebackend.entity.Post;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.PostRepository;
import com.qtanime.animebackend.service.PostService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    @Override
    public List<Post> getAll() {

        return postRepository.findAll();
    }

    @Override
    public Post getById(Long id) {

        return postRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Post không tồn tại"));
    }

    @Override
    public Post create(Post post) {

        return postRepository.save(post);
    }

    @Override
    public Post update(Long id, Post post) {

        Post oldPost = getById(id);

        oldPost.setTitle(post.getTitle());
        oldPost.setContent(post.getContent());
        oldPost.setTopic(post.getTopic());

        return postRepository.save(oldPost);
    }

    @Override
    public void delete(Long id) {

        Post post = getById(id);

        postRepository.delete(post);
    }
}