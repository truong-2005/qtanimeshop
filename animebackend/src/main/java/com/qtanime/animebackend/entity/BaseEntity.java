package com.qtanime.animebackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
public class BaseEntity {

    // =========================================
    // ID
    // =========================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================
    // CREATED AT
    // =========================================

    private LocalDateTime createdAt;

    // =========================================
    // UPDATED AT
    // =========================================

    private LocalDateTime updatedAt;

    // =========================================
    // PRE PERSIST
    // =========================================

    @PrePersist
    public void prePersist() {

        createdAt = LocalDateTime.now();

        updatedAt = LocalDateTime.now();
    }

    // =========================================
    // PRE UPDATE
    // =========================================

    @PreUpdate
    public void preUpdate() {

        updatedAt = LocalDateTime.now();
    }
}