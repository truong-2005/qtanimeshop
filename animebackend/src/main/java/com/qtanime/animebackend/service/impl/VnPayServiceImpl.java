package com.qtanime.animebackend.service.impl;

import com.qtanime.animebackend.config.VnPayConfig;
import com.qtanime.animebackend.dto.payment.VnPayRequest;
import com.qtanime.animebackend.entity.Order;
import com.qtanime.animebackend.entity.Payment;
import com.qtanime.animebackend.enums.PaymentMethod;
import com.qtanime.animebackend.enums.PaymentStatus;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.OrderRepository;
import com.qtanime.animebackend.repository.PaymentRepository;
import com.qtanime.animebackend.service.VnPayService;
import com.qtanime.animebackend.utils.VnPayUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VnPayServiceImpl implements VnPayService {

    private final OrderRepository orderRepository;

    private final PaymentRepository paymentRepository;

    private final VnPayConfig vnPayConfig;

    // =========================
    // TẠO URL THANH TOÁN VNPAY
    // =========================

    @Override
    public String createPaymentUrl(VnPayRequest request, HttpServletRequest httpRequest) {

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Đơn hàng không tồn tại")
                );

        // Tạo mã giao dịch duy nhất
        String txnRef = VnPayUtils.generateTxnRef();

        // Lưu bản ghi thanh toán vào DB với trạng thái UNPAID
        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(PaymentMethod.VNPAY)
                .paymentStatus(PaymentStatus.UNPAID)
                .transactionCode(txnRef)
                .amount(request.getAmount())
                .build();

        paymentRepository.save(payment);

        // =========================
        // BUILD PARAMS GỬI LÊN VNPAY
        // Lưu ý: vnp_Amount = số tiền * 100 (VNPay dùng đơn vị VND*100)
        // =========================

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version",    "2.1.0");
        vnpParams.put("vnp_Command",    "pay");
        vnpParams.put("vnp_TmnCode",    vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount",     String.valueOf((long)(request.getAmount() * 100)));
        vnpParams.put("vnp_CurrCode",   "VND");
        vnpParams.put("vnp_TxnRef",     txnRef);
        vnpParams.put("vnp_OrderInfo",  "Thanh toan don hang " + request.getOrderId());
        vnpParams.put("vnp_OrderType",  "other");
        vnpParams.put("vnp_Locale",     "vn");
        vnpParams.put("vnp_ReturnUrl",  vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr",     getClientIp(httpRequest));
        
        String createDate = VnPayUtils.getCurrentTime();
        vnpParams.put("vnp_CreateDate", createDate);
        
        // Add expire date (15 minutes from now) to fix VNPay sandbox "timer is not defined" error
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        java.time.LocalDateTime expire = now.plusMinutes(15);
        String expireDate = expire.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        vnpParams.put("vnp_ExpireDate", expireDate);

        // Build query string (đã sort theo key - bắt buộc để ký đúng)
        String queryString = VnPayUtils.buildQueryString(vnpParams);

        // Tạo chữ ký HMAC-SHA512
        String secureHash = VnPayUtils.hmacSHA512(vnPayConfig.getHashSecret(), queryString);

        // URL cuối cùng gửi về client
        return vnPayConfig.getPayUrl() + "?" + queryString + "&vnp_SecureHash=" + secureHash;
    }

    // =========================
    // XỬ LÝ CALLBACK TỪ VNPAY
    // =========================

    @Override
    public boolean paymentCallback(Map<String, String> params) {

        // Lấy chữ ký VNPay gửi về
        String receivedHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        // Tính lại chữ ký từ params còn lại (đã sort)
        String queryString    = VnPayUtils.buildQueryString(params);
        String calculatedHash = VnPayUtils.hmacSHA512(vnPayConfig.getHashSecret(), queryString);

        // Kiểm tra tính toàn vẹn của dữ liệu
        if (!calculatedHash.equalsIgnoreCase(receivedHash)) {
            throw new RuntimeException("Chữ ký VNPay không hợp lệ - có thể bị giả mạo!");
        }

        String txnRef      = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");

        Payment payment = paymentRepository.findByTransactionCode(txnRef)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Không tìm thấy giao dịch: " + txnRef)
                );

        if ("00".equals(responseCode)) {
            // Thanh toán thành công
            payment.setPaymentStatus(PaymentStatus.PAID);

            Order order = payment.getOrder();
            order.setPaymentStatus(PaymentStatus.PAID);
            orderRepository.save(order);
        } else {
            // Thanh toán thất bại hoặc bị huỷ
            payment.setPaymentStatus(PaymentStatus.FAILED);
        }

        paymentRepository.save(payment);
        return "00".equals(responseCode);
    }

    // =========================
    // LẤY IP CLIENT
    // =========================

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // Nếu có nhiều IP (proxy chain), lấy IP đầu tiên
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}