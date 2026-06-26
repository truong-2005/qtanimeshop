package com.qtanime.animebackend.service;

import com.qtanime.animebackend.dto.payment.VnPayRequest;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface VnPayService {

    String createPaymentUrl(VnPayRequest request, HttpServletRequest httpRequest);

    boolean paymentCallback(Map<String, String> params);
}