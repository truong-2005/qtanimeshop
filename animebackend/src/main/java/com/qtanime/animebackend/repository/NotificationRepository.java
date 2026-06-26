package com.qtanime.animebackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qtanime.animebackend.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
