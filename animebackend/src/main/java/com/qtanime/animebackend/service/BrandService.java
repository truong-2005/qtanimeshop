package com.qtanime.animebackend.service;

import java.util.List;

import com.qtanime.animebackend.entity.Brand;

public interface BrandService {

    List<Brand> getAll();

    Brand getById(Long id);

    Brand create(Brand brand);

    Brand update(Long id, Brand brand);

    void delete(Long id);
}