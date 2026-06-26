package com.qtanime.animebackend.mapper;

import org.springframework.stereotype.Component;

import com.qtanime.animebackend.dto.order.OrderResponse;
import com.qtanime.animebackend.entity.Order;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {

        if (order == null) {
            return null;
        }

        return OrderResponse.builder()
                .orderId(order.getId())
                .receiverName(order.getReceiverName())
                .phone(order.getPhone())
                .address(order.getAddress())
                .totalPrice(order.getTotalPrice())
                .orderStatus(
                        order.getOrderStatus() != null
                                ? order.getOrderStatus().name()
                                : null
                )
                .paymentMethod(
                        order.getPaymentMethod() != null
                                ? order.getPaymentMethod().name()
                                : null
                )
                .paymentStatus(
                        order.getPaymentStatus() != null
                                ? order.getPaymentStatus().name()
                                : null
                )
                .build();
    }
}