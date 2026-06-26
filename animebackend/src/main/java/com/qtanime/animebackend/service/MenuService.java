package com.qtanime.animebackend.service;

import java.util.List;

import com.qtanime.animebackend.entity.Menu;

public interface MenuService {

    List<Menu> getAll();

    Menu getById(Long id);

    Menu create(Menu menu);

    Menu update(Long id, Menu menu);

    void delete(Long id);
}