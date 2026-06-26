package com.qtanime.animebackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qtanime.animebackend.entity.Topic;

public interface TopicRepository extends JpaRepository<Topic, Long> {
}