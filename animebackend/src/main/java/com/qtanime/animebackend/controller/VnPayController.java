package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.dto.common.MessageResponse;
import com.qtanime.animebackend.dto.payment.VnPayRequest;
import com.qtanime.animebackend.service.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vnpay")
public class VnPayController {

    private final VnPayService vnPayService;

    // =========================
    // TẠO URL THANH TOÁN
    // =========================

    @PostMapping("/create-payment")
    public MessageResponse createPayment(
            @RequestBody VnPayRequest request,
            HttpServletRequest httpRequest
    ) {
        String paymentUrl = vnPayService.createPaymentUrl(request, httpRequest);

        return MessageResponse.builder()
                .message(paymentUrl)
                .build();
    }

    // =========================
    // CALLBACK TỪ VNPAY (GET redirect)
    // VNPay gọi về URL này sau khi user thanh toán xong
    // =========================

    @GetMapping("/payment-callback")
    public MessageResponse paymentCallback(
            @RequestParam Map<String, String> allParams
    ) {
        // Copy sang HashMap để có thể xóa key (params từ @RequestParam là unmodifiable)
        Map<String, String> params = new HashMap<>(allParams);

        boolean success = vnPayService.paymentCallback(params);

        return MessageResponse.builder()
                .message(success ? "Thanh toán thành công" : "Thanh toán thất bại hoặc bị huỷ")
                .build();
    }
}