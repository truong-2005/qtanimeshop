package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.dto.payment.PaymentRequest;
import com.qtanime.animebackend.dto.payment.PaymentResponse;
import com.qtanime.animebackend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public List<PaymentResponse> getAll() {

        return paymentService.getAll();
    }

    @GetMapping("/{id}")
    public PaymentResponse getById(
            @PathVariable Long id
    ) {

        return paymentService.getById(id);
    }

    @PostMapping
    public PaymentResponse create(
            @RequestBody PaymentRequest request
    ) {

        return paymentService.create(request);
    }

    @PutMapping("/{id}")
    public PaymentResponse update(
            @PathVariable Long id,
            @RequestBody PaymentRequest request
    ) {

        return paymentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {

        paymentService.delete(id);
    }
}