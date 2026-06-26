package com.qtanime.animebackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qtanime.animebackend.entity.Menu;

public interface MenuRepository extends JpaRepository<Menu, Long> {
}