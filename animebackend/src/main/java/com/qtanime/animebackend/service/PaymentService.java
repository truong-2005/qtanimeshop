package com.qtanime.animebackend.service;

import java.util.List;

import com.qtanime.animebackend.dto.payment.PaymentRequest;
import com.qtanime.animebackend.dto.payment.PaymentResponse;

public interface PaymentService {

    List<PaymentResponse> getAll();

    PaymentResponse getById(Long id);

    PaymentResponse create(PaymentRequest request);

    PaymentResponse update(Long id, PaymentRequest request);

    void delete(Long id);
}