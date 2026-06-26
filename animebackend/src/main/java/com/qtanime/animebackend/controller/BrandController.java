package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.entity.Brand;
import com.qtanime.animebackend.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    public List<Brand> getAll() {

        return brandService.getAll();
    }

    @GetMapping("/{id}")
    public Brand getById(@PathVariable Long id) {

        return brandService.getById(id);
    }

    @PostMapping
    public Brand create(@RequestBody Brand brand) {

        return brandService.create(brand);
    }

    @PutMapping("/{id}")
    public Brand update(
            @PathVariable Long id,
            @RequestBody Brand brand
    ) {

        return brandService.update(id, brand);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {

        brandService.delete(id);
    }
}