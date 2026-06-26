package com.qtanime.animebackend.service.impl;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.qtanime.animebackend.entity.Notification;
import com.qtanime.animebackend.repository.NotificationRepository;
import com.qtanime.animebackend.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public List<Notification> getAll() {

        return notificationRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @Override
    public Notification create(Notification notification) {

        return notificationRepository.save(notification);
    }
}
