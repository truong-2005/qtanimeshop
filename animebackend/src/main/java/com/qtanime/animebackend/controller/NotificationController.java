package com.qtanime.animebackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qtanime.animebackend.entity.Notification;
import com.qtanime.animebackend.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<Notification> getNotifications() {

        return notificationService.getAll();
    }

    @PostMapping("/send")
    public Notification sendNotification(
            @RequestBody Notification notification
    ) {

        return notificationService.create(notification);
    }
}