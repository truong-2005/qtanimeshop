package com.qtanime.animebackend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qtanime.animebackend.entity.Topic;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.TopicRepository;
import com.qtanime.animebackend.service.TopicService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;

    @Override
    public List<Topic> getAll() {

        return topicRepository.findAll();
    }

    @Override
    public Topic getById(Long id) {

        return topicRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Topic không tồn tại"));
    }

    @Override
    public Topic create(Topic topic) {

        return topicRepository.save(topic);
    }

    @Override
    public Topic update(Long id, Topic topic) {

        Topic oldTopic = getById(id);

        oldTopic.setName(topic.getName());

        return topicRepository.save(oldTopic);
    }

    @Override
    public void delete(Long id) {

        Topic topic = getById(id);

        topicRepository.delete(topic);
    }
}