package com.qtanime.animebackend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.qtanime.animebackend.dto.order.OrderRequest;
import com.qtanime.animebackend.dto.order.OrderResponse;
import com.qtanime.animebackend.dto.order.OrderStatusRequest;
import com.qtanime.animebackend.dto.order.PaymentStatusRequest;
import com.qtanime.animebackend.dto.order.OrderFilterRequest;
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
import com.qtanime.animebackend.repository.OrderSpecification;
import com.qtanime.animebackend.service.MailService;
import com.qtanime.animebackend.service.OrderService;
import com.qtanime.animebackend.service.CouponService;
import com.qtanime.animebackend.entity.Coupon;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    private final OrderItemRepository orderItemRepository;

    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final UserRepository userRepository;

    private final MailService mailService;

    private final CouponService couponService;

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

        Double discountAmount = 0.0;
        String appliedCouponCode = null;

        if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
            Coupon coupon = couponService.getValidCouponByCode(request.getCouponCode(), totalPrice);
            if (coupon.getDiscountType() == com.qtanime.animebackend.enums.DiscountType.PERCENT) {
                discountAmount = totalPrice * (coupon.getDiscountValue() / 100.0);
            } else {
                discountAmount = coupon.getDiscountValue();
            }
            if (discountAmount > totalPrice) {
                discountAmount = totalPrice;
            }
            appliedCouponCode = coupon.getCode();
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            // JPA will auto update coupon since it's in transaction
        }

        Order order = Order.builder()
                .user(user)
                .receiverName(request.getReceiverName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .totalPrice(totalPrice - discountAmount)
                .discountAmount(discountAmount)
                .couponCode(appliedCouponCode)
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

        // Delete cart items safely
        List<CartItem> itemsToDelete = new ArrayList<>(cart.getCartItems());
        cart.getCartItems().clear();
        cartItemRepository.deleteAll(itemsToDelete);

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
    public List<OrderResponse> getAll(OrderFilterRequest request) {

        return orderRepository.findAll(OrderSpecification.getFilter(request))
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
    public OrderResponse updatePaymentStatus(
            Long id,
            PaymentStatusRequest request
    ) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Đơn hàng không tồn tại"));

        order.setPaymentStatus(request.getPaymentStatus());

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
                .couponCode(order.getCouponCode())
                .discountAmount(order.getDiscountAmount())
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