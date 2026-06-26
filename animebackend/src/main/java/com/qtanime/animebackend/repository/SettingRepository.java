package com.qtanime.animebackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qtanime.animebackend.entity.Setting;

public interface SettingRepository extends JpaRepository<Setting, Long> {
}