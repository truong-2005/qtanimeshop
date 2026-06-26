package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.entity.Setting;
import com.qtanime.animebackend.service.SettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/settings")
public class SettingController {

    private final SettingService settingService;

    @GetMapping
    public Setting getSetting() {

        return settingService.getSetting();
    }

    @PutMapping
    public Setting update(
            @RequestBody Setting setting
    ) {

        return settingService.update(setting);
    }
}