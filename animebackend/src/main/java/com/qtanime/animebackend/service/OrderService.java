package com.qtanime.animebackend.service;

import java.util.List;

import com.qtanime.animebackend.dto.order.OrderRequest;
import com.qtanime.animebackend.dto.order.OrderResponse;
import com.qtanime.animebackend.dto.order.OrderStatusRequest;
import com.qtanime.animebackend.dto.order.PaymentStatusRequest;

public interface OrderService {

    // =========================
    // USER
    // =========================

    OrderResponse createOrder(OrderRequest request);

    List<OrderResponse> getMyOrders();

    OrderResponse getMyOrderDetail(Long orderId);

    void cancelOrder(Long orderId);

    // =========================
    // ADMIN
    // =========================

    List<OrderResponse> getAll();

    OrderResponse getById(Long id);

    OrderResponse updateStatus(Long id, OrderStatusRequest request);

    OrderResponse updatePaymentStatus(Long id, PaymentStatusRequest request);

    void delete(Long id);
}