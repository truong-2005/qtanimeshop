package com.qtanime.animebackend.controller;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qtanime.animebackend.dto.common.MessageResponse;
import com.qtanime.animebackend.dto.user.ChangePasswordRequest;
import com.qtanime.animebackend.dto.user.UpdateProfileRequest;
import com.qtanime.animebackend.dto.user.UserResponse;
import com.qtanime.animebackend.entity.User;
import com.qtanime.animebackend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // =========================
    // ADMIN CRUD
    // =========================

    @GetMapping
    public List<UserResponse> getAll() {

        return userService.getAll();
    }

    @GetMapping("/{id}")
    public UserResponse getById(
            @PathVariable Long id
    ) {

        return userService.getById(id);
    }

    @PostMapping
    public User create(
            @RequestBody User user
    ) {

        return userService.create(user);
    }

    @PutMapping("/{id}")
    public User update(
            @PathVariable Long id,
            @RequestBody User user
    ) {

        return userService.update(id, user);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(
            @PathVariable Long id
    ) {

        userService.delete(id);

        return MessageResponse.builder()
                .message("Xóa user thành công")
                .build();
    }

    // =========================
    // USER PROFILE
    // =========================

    @GetMapping("/me")
    public UserResponse getMyProfile() {

        return userService.getMyProfile();
    }

   @PutMapping(
        value = "/me",
        consumes = "multipart/form-data"
)
public UserResponse updateProfile(
        @Valid
        @ModelAttribute UpdateProfileRequest request
){

        return userService.updateProfile(request);
    }

    @PutMapping("/change-password")
    public MessageResponse changePassword(
            @Valid @RequestBody ChangePasswordRequest request
    ) {

        userService.changePassword(request);

        return MessageResponse.builder()
                .message("Đổi mật khẩu thành công")
                .build();
    }
}