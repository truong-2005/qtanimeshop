package com.qtanime.animebackend.dto.product;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageRequest {

    @NotNull(
            message = "Hình ảnh không được để trống"
    )
    private MultipartFile image;

    // =========================
    // VALIDATE IMAGE
    // =========================

    public boolean isImageValid() {

        if (
                image == null
                        ||
                        image.isEmpty()
        ) {

            return false;
        }

        String contentType =
                image.getContentType();

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

    public String getImageValidationMessage() {

        if (
                image == null
                        ||
                        image.isEmpty()
        ) {

            return "Hình ảnh không được để trống";
        }

        if (!isImageValid()) {

            return "Hình ảnh phải là PNG, JPG, JPEG hoặc WEBP";
        }

        return null;
    }
}