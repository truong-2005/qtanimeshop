package com.qtanime.animebackend.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long orderId;

    private String receiverName;

    private String phone;

    private String address;

    private Double totalPrice;

    private String orderStatus;

    private String paymentMethod;

    private String paymentStatus;
}