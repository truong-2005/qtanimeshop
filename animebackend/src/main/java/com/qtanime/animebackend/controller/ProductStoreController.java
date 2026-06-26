package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.dto.common.MessageResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product-store")
public class ProductStoreController {

    @GetMapping
    public MessageResponse getStoreInformation() {

        return MessageResponse.builder()
                .message("Thông tin kho sản phẩm")
                .build();
    }

    @PostMapping
    public MessageResponse createStore() {

        return MessageResponse.builder()
                .message("Tạo kho sản phẩm thành công")
                .build();
    }

    @PutMapping("/{id}")
    public MessageResponse updateStore(
            @PathVariable Long id
    ) {

        return MessageResponse.builder()
                .message("Cập nhật kho sản phẩm thành công")
                .build();
    }

    @DeleteMapping("/{id}")
    public MessageResponse deleteStore(
            @PathVariable Long id
    ) {

        return MessageResponse.builder()
                .message("Xóa kho sản phẩm thành công")
                .build();
    }
}