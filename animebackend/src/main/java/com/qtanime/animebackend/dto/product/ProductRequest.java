package com.qtanime.animebackend.dto.product;

import org.springframework.web.multipart.MultipartFile;

import com.qtanime.animebackend.enums.ProductStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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
public class ProductRequest {

    @NotBlank(
            message = "Tên sản phẩm không được để trống"
    )
    private String name;

    @NotBlank(
            message = "Slug không được để trống"
    )
    private String slug;

    private String description;

    @NotNull(
            message = "Giá sản phẩm không được để trống"
    )
    @DecimalMin(
            value = "0",
            message = "Giá sản phẩm phải lớn hơn hoặc bằng 0"
    )
    private Double price;

    @NotNull(
            message = "Số lượng không được để trống"
    )
    @Min(
            value = 0,
            message = "Số lượng phải lớn hơn hoặc bằng 0"
    )
    private Integer quantity;

    private ProductStatus status;

    @NotNull(
            message = "Danh mục không được để trống"
    )
    private Long categoryId;

    @NotNull(
            message = "Thương hiệu không được để trống"
    )
    private Long brandId;

    private MultipartFile thumbnail;

    // =========================
    // VALIDATE IMAGE
    // =========================

    public boolean isThumbnailValid() {

        if (
                thumbnail == null
                        ||
                        thumbnail.isEmpty()
        ) {

            return true;
        }

        String contentType =
                thumbnail.getContentType();

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

    public String getThumbnailValidationMessage() {

        if (
                thumbnail == null
                        ||
                        thumbnail.isEmpty()
        ) {

            return null;
        }

        if (!isThumbnailValid()) {

            return "Thumbnail phải là ảnh PNG, JPG, JPEG hoặc WEBP";
        }

        return null;
    }
}