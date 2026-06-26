package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.entity.Post;
import com.qtanime.animebackend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    @GetMapping
    public List<Post> getAll() {

        return postService.getAll();
    }

    @GetMapping("/{id}")
    public Post getById(
            @PathVariable Long id
    ) {

        return postService.getById(id);
    }

    @PostMapping
    public Post create(
            @RequestBody Post post
    ) {

        return postService.create(post);
    }

    @PutMapping("/{id}")
    public Post update(
            @PathVariable Long id,
            @RequestBody Post post
    ) {

        return postService.update(id, post);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {

        postService.delete(id);
    }
}