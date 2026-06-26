package com.qtanime.animebackend.dto.order;

import com.qtanime.animebackend.enums.PaymentMethod;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderRequest {

    @NotBlank(message = "Tên người nhận không được để trống")
    private String receiverName;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    private String note;

    private PaymentMethod paymentMethod;
}