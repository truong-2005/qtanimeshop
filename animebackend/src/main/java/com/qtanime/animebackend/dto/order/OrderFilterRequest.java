package com.qtanime.animebackend.dto.order;

import com.qtanime.animebackend.enums.OrderStatus;
import com.qtanime.animebackend.enums.PaymentStatus;
import lombok.Data;

@Data
public class OrderFilterRequest {
    private String search;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
}
