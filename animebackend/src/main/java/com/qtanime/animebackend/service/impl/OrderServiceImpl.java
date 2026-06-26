package com.qtanime.animebackend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.qtanime.animebackend.dto.order.OrderRequest;
import com.qtanime.animebackend.dto.order.OrderResponse;
import com.qtanime.animebackend.dto.order.OrderStatusRequest;
import com.qtanime.animebackend.entity.Cart;
import com.qtanime.animebackend.entity.CartItem;
import com.qtanime.animebackend.entity.Order;
import com.qtanime.animebackend.entity.OrderItem;
import com.qtanime.animebackend.entity.User;
import com.qtanime.animebackend.enums.OrderStatus;
import com.qtanime.animebackend.enums.PaymentStatus;
import com.qtanime.animebackend.exception.BadRequestException;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.CartItemRepository;
import com.qtanime.animebackend.repository.CartRepository;
import com.qtanime.animebackend.repository.OrderItemRepository;
import com.qtanime.animebackend.repository.OrderRepository;
import com.qtanime.animebackend.repository.UserRepository;
import com.qtanime.animebackend.service.MailService;
import com.qtanime.animebackend.service.OrderService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    private final OrderItemRepository orderItemRepository;

    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final UserRepository userRepository;

    private final MailService mailService;

    @Override
    public OrderResponse createOrder(OrderRequest request) {

        User user = getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Giỏ hàng không tồn tại"));

        if (cart.getCartItems().isEmpty()) {
            throw new BadRequestException("Giỏ hàng đang trống");
        }

        double totalPrice = 0;

        for (CartItem item : cart.getCartItems()) {

            totalPrice += item.getPrice() * item.getQuantity();
        }

        Order order = Order.builder()
                .user(user)
                .receiverName(request.getReceiverName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .totalPrice(totalPrice)
                .orderStatus(OrderStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.UNPAID)
                .orderItems(new ArrayList<>())
                .build();

        orderRepository.save(order);

        for (CartItem cartItem : cart.getCartItems()) {

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPrice())
                    .build();

            orderItemRepository.save(orderItem);
        }

        cartItemRepository.deleteAll(cart.getCartItems());

        mailService.sendOrderSuccessEmail(
                user.getEmail(),
                String.valueOf(order.getId())
        );

        return mapToResponse(order);
    }

    @Override
    public List<OrderResponse> getMyOrders() {

        User user = getCurrentUser();

        List<Order> orders = orderRepository.findByUserId(user.getId());

        return orders.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public OrderResponse getMyOrderDetail(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Đơn hàng không tồn tại"));

        return mapToResponse(order);
    }

    @Override
    public void cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Đơn hàng không tồn tại"));

        if (!order.getOrderStatus().equals(OrderStatus.PENDING)) {
            throw new BadRequestException(
                    "Không thể hủy đơn hàng này");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);

        orderRepository.save(order);
    }

    @Override
    public List<OrderResponse> getAll() {

        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public OrderResponse getById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Đơn hàng không tồn tại"));

        return mapToResponse(order);
    }

    @Override
    public OrderResponse updateStatus(
            Long id,
            OrderStatusRequest request
    ) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Đơn hàng không tồn tại"));

        order.setOrderStatus(request.getOrderStatus());

        orderRepository.save(order);

        return mapToResponse(order);
    }

    @Override
    public void delete(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Đơn hàng không tồn tại"));

        orderRepository.delete(order);
    }

    private OrderResponse mapToResponse(Order order) {

        return OrderResponse.builder()
                .orderId(order.getId())
                .receiverName(order.getReceiverName())
                .phone(order.getPhone())
                .address(order.getAddress())
                .totalPrice(order.getTotalPrice())
                .orderStatus(order.getOrderStatus().name())
                .paymentMethod(order.getPaymentMethod().name())
                .paymentStatus(order.getPaymentStatus().name())
                .build();
    }

    private User getCurrentUser() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User không tồn tại"));
    }
}