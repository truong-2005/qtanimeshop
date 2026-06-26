package com.qtanime.animebackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.qtanime.animebackend.entity.Banner;
import com.qtanime.animebackend.service.BannerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/banners")
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    public List<Banner> getAll() {

        return bannerService.getAll();
    }

    @GetMapping("/{id}")
    public Banner getById(
            @PathVariable Long id
    ) {

        return bannerService.getById(id);
    }

    @PostMapping(
            consumes = "multipart/form-data"
    )
    public Banner create(

            @ModelAttribute Banner banner,

            @RequestPart(
                    value = "file",
                    required = false
            )
            MultipartFile file

    ) {

        return bannerService.create(
                banner,
                file
        );
    }

    @PutMapping(
            value = "/{id}",
            consumes = "multipart/form-data"
    )
    public Banner update(

            @PathVariable Long id,

            @ModelAttribute Banner banner,

            @RequestPart(
                    value = "file",
                    required = false
            )
            MultipartFile file

    ) {

        return bannerService.update(
                id,
                banner,
                file
        );
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {

        bannerService.delete(id);
    }
}