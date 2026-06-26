package com.qtanime.animebackend.dto.payment;

import com.qtanime.animebackend.enums.PaymentMethod;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotNull(message = "Id đơn hàng không được để trống")
    private Long orderId;

    @NotNull(message = "Phương thức thanh toán không được để trống")
    private PaymentMethod paymentMethod;
}