package com.qtanime.animebackend.service.impl;

import org.springframework.stereotype.Service;

import com.qtanime.animebackend.entity.Setting;
import com.qtanime.animebackend.repository.SettingRepository;
import com.qtanime.animebackend.service.SettingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SettingServiceImpl implements SettingService {

    private final SettingRepository settingRepository;

    @Override
    public Setting getSetting() {

        return settingRepository.findAll()
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    Setting defaultSetting = Setting.builder()
                            .siteName("Anime Store")
                            .email("support@animestore.vn")
                            .hotline("091 234 5678")
                            .address("Hà Nội, Việt Nam")
                            .slogan("Mô hình chính hãng Nhật Bản")
                            .build();
                    return settingRepository.save(defaultSetting);
                });
    }

    @Override
    public Setting update(Setting setting) {

        Setting oldSetting = getSetting();

        oldSetting.setSiteName(setting.getSiteName());
        oldSetting.setEmail(setting.getEmail());
        oldSetting.setHotline(setting.getHotline());
        oldSetting.setAddress(setting.getAddress());
        oldSetting.setSlogan(setting.getSlogan());

        return settingRepository.save(oldSetting);
    }
}