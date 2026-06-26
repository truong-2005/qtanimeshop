package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.entity.Menu;
import com.qtanime.animebackend.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/menus")
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public List<Menu> getAll() {

        return menuService.getAll();
    }

    @GetMapping("/{id}")
    public Menu getById(@PathVariable Long id) {

        return menuService.getById(id);
    }

    @PostMapping
    public Menu create(@RequestBody Menu menu) {

        return menuService.create(menu);
    }

    @PutMapping("/{id}")
    public Menu update(
            @PathVariable Long id,
            @RequestBody Menu menu
    ) {

        return menuService.update(id, menu);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {

        menuService.delete(id);
    }
}