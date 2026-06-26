package com.qtanime.animebackend.enums;

public enum PaymentMethod {

    COD("Thanh toán khi nhận hàng"),
    VNPAY("Thanh toán VNPay");

    private final String description;

    PaymentMethod(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}