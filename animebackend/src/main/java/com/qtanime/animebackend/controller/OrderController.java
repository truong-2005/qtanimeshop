package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.dto.order.OrderRequest;
import com.qtanime.animebackend.dto.order.OrderResponse;
import com.qtanime.animebackend.dto.order.OrderStatusRequest;
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
    public List<OrderResponse> getAll() {

        return orderService.getAll();
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

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {

        orderService.delete(id);
    }
}