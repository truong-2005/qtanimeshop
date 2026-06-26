package com.qtanime.animebackend.service.impl;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.qtanime.animebackend.service.MailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendVerifyEmail(String to, String token) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);

        message.setSubject("Xác thực tài khoản");

        message.setText(
                "Link xác thực: http://localhost:8083/api/auth/verify?token="
                        + token
        );

        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Lỗi gửi email: " + e.getMessage());
        }
    }

    @Override
    public void sendResetPasswordEmail(String to, String token) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);

        message.setSubject("Đặt lại mật khẩu");

        message.setText(
                "Link reset password: http://localhost:8083/reset-password?token="
                        + token
        );

        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Lỗi gửi email: " + e.getMessage());
        }
    }

    @Override
    public void sendOrderSuccessEmail(String to, String orderCode) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);

        message.setSubject("Đặt hàng thành công");

        message.setText(
                "Đơn hàng của bạn đã được tạo thành công. Mã đơn: "
                        + orderCode
        );

        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Lỗi gửi email: " + e.getMessage());
        }
    }
}