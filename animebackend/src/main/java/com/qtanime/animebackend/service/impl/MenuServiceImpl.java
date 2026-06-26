package com.qtanime.animebackend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qtanime.animebackend.entity.Menu;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.MenuRepository;
import com.qtanime.animebackend.service.MenuService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

    private final MenuRepository menuRepository;

    @Override
    public List<Menu> getAll() {

        return menuRepository.findAll();
    }

    @Override
    public Menu getById(Long id) {

        return menuRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Menu không tồn tại"));
    }

    @Override
    public Menu create(Menu menu) {

        return menuRepository.save(menu);
    }

    @Override
    public Menu update(Long id, Menu menu) {

        Menu oldMenu = getById(id);

        oldMenu.setName(menu.getName());
        oldMenu.setLink(menu.getLink());
        oldMenu.setSortOrder(menu.getSortOrder());

        return menuRepository.save(oldMenu);
    }

    @Override
    public void delete(Long id) {

        Menu menu = getById(id);

        menuRepository.delete(menu);
    }
}