package com.qtanime.animebackend.dto.order;

import com.qtanime.animebackend.enums.PaymentStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentStatusRequest {

    @NotNull(message = "Trạng thái thanh toán không được để trống")
    private PaymentStatus paymentStatus;
}
