package com.qtanime.animebackend.dto.user;

import org.springframework.web.multipart.MultipartFile;

import com.qtanime.animebackend.enums.Gender;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String fullName;

    private String phone;

    private Gender gender;

    // FILE IMAGE
    private MultipartFile avatar;

    // =========================
    // VALIDATE IMAGE
    // =========================

    public boolean isAvatarValid() {

        if (
                avatar == null
                        ||
                        avatar.isEmpty()
        ) {

            return true;
        }

        String contentType =
                avatar.getContentType();

        return contentType != null
                &&
                (
                        contentType.equals("image/png")
                                ||
                                contentType.equals("image/jpg")
                                ||
                                contentType.equals("image/jpeg")
                                ||
                                contentType.equals("image/webp")
                );
    }

    public String getAvatarValidationMessage() {

        if (
                avatar == null
                        ||
                        avatar.isEmpty()
        ) {

            return null;
        }

        if (!isAvatarValid()) {

            return "Ảnh đại diện phải là PNG, JPG, JPEG hoặc WEBP";
        }

        return null;
    }
}