package com.qtanime.animebackend.service;

import java.util.List;

import com.qtanime.animebackend.dto.user.ChangePasswordRequest;
import com.qtanime.animebackend.dto.user.UpdateProfileRequest;
import com.qtanime.animebackend.dto.user.UserResponse;
import com.qtanime.animebackend.entity.User;

public interface UserService {

    // =========================
    // ADMIN CRUD
    // =========================

    List<UserResponse> getAll();

    UserResponse getById(Long id);

    User create(User user);

    User update(Long id, User user);

    void delete(Long id);

    // =========================
    // USER PROFILE
    // =========================

    UserResponse getMyProfile();

    UserResponse updateProfile(UpdateProfileRequest request);

    void changePassword(ChangePasswordRequest request);
}