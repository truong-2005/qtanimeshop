package com.qtanime.animebackend.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.qtanime.animebackend.entity.Banner;

public interface BannerService {

    List<Banner> getAll();

    Banner getById(Long id);

    Banner create(
            Banner banner,
            MultipartFile image
    );

    Banner update(
            Long id,
            Banner banner,
            MultipartFile image
    );

    void delete(Long id);
}