package com.qtanime.animebackend.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qtanime.animebackend.dto.common.MessageResponse;
import com.qtanime.animebackend.dto.product.ProductImageRequest;
import com.qtanime.animebackend.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product-images")
public class ProductImageController {

    private final ProductService productService;

    @PostMapping(
            value = "/{productId}",
            consumes = "multipart/form-data"
    )
    public MessageResponse addImage(
            @PathVariable Long productId,

            @Valid
            @ModelAttribute ProductImageRequest request
    ) {

        productService.addImage(productId, request);

        return MessageResponse.builder()
                .message("Thêm hình ảnh sản phẩm thành công")
                .build();
    }

    @DeleteMapping("/{imageId}")
    public MessageResponse deleteImage(
            @PathVariable Long imageId
    ) {

        productService.deleteImage(imageId);

        return MessageResponse.builder()
                .message("Xóa hình ảnh sản phẩm thành công")
                .build();
    }
}