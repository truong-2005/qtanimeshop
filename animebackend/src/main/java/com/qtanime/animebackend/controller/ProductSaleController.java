package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.dto.common.MessageResponse;
import com.qtanime.animebackend.dto.product.ProductSaleRequest;
import com.qtanime.animebackend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product-sales")
public class ProductSaleController {

    private final ProductService productService;

    @PostMapping("/{productId}")
    public MessageResponse createSale(
            @PathVariable Long productId,
            @RequestBody ProductSaleRequest request
    ) {

        productService.createSale(productId, request);

        return MessageResponse.builder()
                .message("Tạo sale sản phẩm thành công")
                .build();
    }

    @DeleteMapping("/{productId}")
    public MessageResponse removeSale(
            @PathVariable Long productId
    ) {

        productService.removeSale(productId);

        return MessageResponse.builder()
                .message("Xóa sale sản phẩm thành công")
                .build();
    }
}