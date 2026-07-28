package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.dto.order.OrderRequest;
import com.qtanime.animebackend.dto.order.OrderResponse;
import com.qtanime.animebackend.dto.order.OrderStatusRequest;
import com.qtanime.animebackend.dto.order.PaymentStatusRequest;
import com.qtanime.animebackend.dto.order.OrderFilterRequest;
import com.qtanime.animebackend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    // =========================
    // USER
    // =========================

    @PostMapping
    public OrderResponse createOrder(
            @Valid @RequestBody OrderRequest request
    ) {

        return orderService.createOrder(request);
    }

    @GetMapping("/my-orders")
    public List<OrderResponse> getMyOrders() {

        return orderService.getMyOrders();
    }

    @GetMapping("/my-orders/{id}")
    public OrderResponse getMyOrderDetail(
            @PathVariable Long id
    ) {

        return orderService.getMyOrderDetail(id);
    }

    @PutMapping("/cancel/{id}")
    public void cancelOrder(
            @PathVariable Long id
    ) {

        orderService.cancelOrder(id);
    }

    // =========================
    // ADMIN
    // =========================

    @GetMapping
    public List<OrderResponse> getAll(@ModelAttribute OrderFilterRequest request) {

        return orderService.getAll(request);
    }

    @GetMapping("/{id}")
    public OrderResponse getById(
            @PathVariable Long id
    ) {

        return orderService.getById(id);
    }

    @PutMapping("/{id}/status")
    public OrderResponse updateStatus(
            @PathVariable Long id,
            @RequestBody OrderStatusRequest request
    ) {

        return orderService.updateStatus(id, request);
    }

    @PutMapping("/{id}/payment-status")
    public OrderResponse updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody PaymentStatusRequest request
    ) {

        return orderService.updatePaymentStatus(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {

        orderService.delete(id);
    }
}