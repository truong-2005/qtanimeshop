package com.qtanime.animebackend.enums;

public enum RoleName {

    ADMIN("Quản trị viên"),
    CUSTOMER("Khách hàng");

    private final String description;

    RoleName(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}