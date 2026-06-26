package com.qtanime.animebackend.enums;

public enum ProductStatus {

    ACTIVE("Đang bán"),
    OUT_OF_STOCK("Hết hàng"),
    DISCONTINUED("Ngừng kinh doanh"),
    HIDDEN("Ẩn sản phẩm");

    private final String description;

    ProductStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}