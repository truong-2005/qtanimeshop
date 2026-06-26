package com.qtanime.animebackend.service;

import java.util.List;

import com.qtanime.animebackend.dto.order.OrderRequest;
import com.qtanime.animebackend.dto.order.OrderResponse;
import com.qtanime.animebackend.dto.order.OrderStatusRequest;

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

    void delete(Long id);
}