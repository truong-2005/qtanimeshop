package com.qtanime.animebackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qtanime.animebackend.entity.Banner;

public interface BannerRepository extends JpaRepository<Banner, Long> {
}