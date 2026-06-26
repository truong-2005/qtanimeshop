package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.entity.Topic;
import com.qtanime.animebackend.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    public List<Topic> getAll() {

        return topicService.getAll();
    }

    @GetMapping("/{id}")
    public Topic getById(
            @PathVariable Long id
    ) {

        return topicService.getById(id);
    }

    @PostMapping
    public Topic create(
            @RequestBody Topic topic
    ) {

        return topicService.create(topic);
    }

    @PutMapping("/{id}")
    public Topic update(
            @PathVariable Long id,
            @RequestBody Topic topic
    ) {

        return topicService.update(id, topic);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {

        topicService.delete(id);
    }
}