package com.qtanime.animebackend.service;

import java.util.List;

import com.qtanime.animebackend.entity.Notification;

public interface NotificationService {

    List<Notification> getAll();

    Notification create(Notification notification);
}
