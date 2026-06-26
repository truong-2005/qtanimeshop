package com.qtanime.animebackend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qtanime.animebackend.entity.Brand;
import com.qtanime.animebackend.exception.BadRequestException;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.BrandRepository;
import com.qtanime.animebackend.service.BrandService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    @Override
    public List<Brand> getAll() {

        return brandRepository.findAll();
    }

    @Override
    public Brand getById(Long id) {

        return brandRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Brand không tồn tại"));
    }

    @Override
    public Brand create(Brand brand) {

        if (brandRepository.existsByName(brand.getName())) {
            throw new BadRequestException("Tên brand đã tồn tại");
        }

        return brandRepository.save(brand);
    }

    @Override
    public Brand update(Long id, Brand brand) {

        Brand oldBrand = getById(id);

        oldBrand.setName(brand.getName());

        return brandRepository.save(oldBrand);
    }

    @Override
    public void delete(Long id) {

        Brand brand = getById(id);

        brandRepository.delete(brand);
    }
}