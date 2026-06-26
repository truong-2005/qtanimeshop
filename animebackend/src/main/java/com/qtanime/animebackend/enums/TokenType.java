package com.qtanime.animebackend.enums;

public enum TokenType {

    ACCESS_TOKEN("Access Token"),
    REFRESH_TOKEN("Refresh Token"),
    EMAIL_VERIFICATION_TOKEN("Token xác thực email"),
    RESET_PASSWORD_TOKEN("Token đặt lại mật khẩu");

    private final String description;

    TokenType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}