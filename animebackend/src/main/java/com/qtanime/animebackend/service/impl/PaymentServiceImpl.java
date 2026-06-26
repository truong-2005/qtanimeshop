package com.qtanime.animebackend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.qtanime.animebackend.dto.payment.PaymentRequest;
import com.qtanime.animebackend.dto.payment.PaymentResponse;
import com.qtanime.animebackend.entity.Order;
import com.qtanime.animebackend.entity.Payment;
import com.qtanime.animebackend.enums.PaymentStatus;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.OrderRepository;
import com.qtanime.animebackend.repository.PaymentRepository;
import com.qtanime.animebackend.service.PaymentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    private final OrderRepository orderRepository;

    @Override
    public List<PaymentResponse> getAll() {

        return paymentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public PaymentResponse getById(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Payment không tồn tại"));

        return mapToResponse(payment);
    }

    @Override
    public PaymentResponse create(PaymentRequest request) {

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Đơn hàng không tồn tại"));

        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.UNPAID)
                .transactionCode(UUID.randomUUID().toString())
                .amount(order.getTotalPrice())
                .build();

        paymentRepository.save(payment);

        return mapToResponse(payment);
    }

    @Override
    public PaymentResponse update(Long id, PaymentRequest request) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Payment không tồn tại"));

        payment.setPaymentMethod(request.getPaymentMethod());

        paymentRepository.save(payment);

        return mapToResponse(payment);
    }

    @Override
    public void delete(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Payment không tồn tại"));

        paymentRepository.delete(payment);
    }

    private PaymentResponse mapToResponse(Payment payment) {

        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .paymentMethod(payment.getPaymentMethod().name())
                .paymentStatus(payment.getPaymentStatus().name())
                .transactionCode(payment.getTransactionCode())
                .amount(payment.getAmount())
                .build();
    }
}