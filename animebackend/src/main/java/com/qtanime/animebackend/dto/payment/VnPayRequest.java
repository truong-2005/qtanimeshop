package com.qtanime.animebackend.dto.payment;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VnPayRequest {

    @NotNull(message = "Id đơn hàng không được để trống")
    private Long orderId;

    @NotNull(message = "Số tiền không được để trống")
    private Double amount;
}