package com.qtanime.animebackend.service.impl;

import org.springframework.stereotype.Service;

import com.qtanime.animebackend.entity.Setting;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
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
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Setting không tồn tại"
                        ));
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