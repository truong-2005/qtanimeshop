package com.qtanime.animebackend.service;

import com.qtanime.animebackend.entity.Setting;

public interface SettingService {

    Setting getSetting();

    Setting update(Setting setting);
}