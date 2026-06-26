package com.qtanime.animebackend.mapper;

import org.springframework.stereotype.Component;

import com.qtanime.animebackend.dto.user.UserResponse;
import com.qtanime.animebackend.entity.User;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {

        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatar(user.getAvatar())
                .gender(
                        user.getGender() != null
                                ? user.getGender().name()
                                : null
                )
                .role(
                        user.getRole() != null
                                ? user.getRole().getName().name()
                                : null
                )
                .build();
    }
}