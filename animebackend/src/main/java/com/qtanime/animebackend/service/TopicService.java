package com.qtanime.animebackend.service;

import java.util.List;

import com.qtanime.animebackend.entity.Topic;

public interface TopicService {

    List<Topic> getAll();

    Topic getById(Long id);

    Topic create(Topic topic);

    Topic update(Long id, Topic topic);

    void delete(Long id);
}