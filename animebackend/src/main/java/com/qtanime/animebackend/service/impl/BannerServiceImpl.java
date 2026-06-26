package com.qtanime.animebackend.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.qtanime.animebackend.entity.Banner;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.BannerRepository;
import com.qtanime.animebackend.service.BannerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl
        implements BannerService {

    private final BannerRepository bannerRepository;

    @Override
    public List<Banner> getAll() {

        return bannerRepository.findAll();
    }

    @Override
    public Banner getById(Long id) {

        return bannerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Banner không tồn tại"
                        ));
    }

    @Override
    public Banner create(
            Banner banner,
            MultipartFile image
    ) {

        if (
                image != null
                        &&
                        !image.isEmpty()
        ) {

            banner.setImage(
                    uploadImage(image)
            );
        }

        return bannerRepository.save(banner);
    }

    @Override
    public Banner update(
            Long id,
            Banner banner,
            MultipartFile image
    ) {

        Banner oldBanner = getById(id);

        oldBanner.setTitle(
                banner.getTitle()
        );

        oldBanner.setLink(
                banner.getLink()
        );

        oldBanner.setDescription(
                banner.getDescription()
        );

        oldBanner.setActive(
                banner.getActive()
        );

        if (
                image != null
                        &&
                        !image.isEmpty()
        ) {

            oldBanner.setImage(
                    uploadImage(image)
            );
        }

        return bannerRepository.save(oldBanner);
    }

    @Override
    public void delete(Long id) {

        Banner banner = getById(id);

        bannerRepository.delete(banner);
    }

    // =========================
    // UPLOAD IMAGE
    // =========================

    private String uploadImage(
            MultipartFile file
    ) {

        try {

            File folder =
                    new File(
                            "uploads/banners"
                    );

            if (!folder.exists()) {

                folder.mkdirs();
            }

            String fileName =
                    UUID.randomUUID()
                            +
                            "_"
                            +
                            file.getOriginalFilename();

            File destination =
                    new File(folder.getAbsolutePath(), fileName);

            file.transferTo(destination);

            return "/uploads/banners/"
                    +
                    fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Upload ảnh banner thất bại"
            );
        }
    }
}