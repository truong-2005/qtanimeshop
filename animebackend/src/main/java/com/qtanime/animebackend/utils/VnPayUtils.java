package com.qtanime.animebackend.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class VnPayUtils {

    // =========================
    // HMAC-SHA512
    // =========================

    public static String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"
            );
            mac.init(secretKey);
            byte[] bytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo chữ ký HMAC-SHA512", e);
        }
    }

    // =========================
    // BUILD QUERY STRING (sort theo key - bắt buộc để ký)
    // =========================

    public static String buildQueryString(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder query = new StringBuilder();
        for (String field : fieldNames) {
            String value = params.get(field);
            if (value != null && !value.isEmpty()) {
                if (query.length() > 0) query.append('&');
                query.append(URLEncoder.encode(field, StandardCharsets.UTF_8));
                query.append('=');
                query.append(URLEncoder.encode(value, StandardCharsets.UTF_8));
            }
        }
        return query.toString();
    }

    // =========================
    // THỜI GIAN HIỆN TẠI (chuẩn VNPay: yyyyMMddHHmmss)
    // =========================

    public static String getCurrentTime() {
        return LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }

    // =========================
    // MÃ GIAO DỊCH DUY NHẤT
    // =========================

    public static String generateTxnRef() {
        return String.valueOf(System.currentTimeMillis());
    }
}
