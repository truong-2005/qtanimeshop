package com.qtanime.animebackend.service;

public interface MailService {

    void sendVerifyEmail(String to, String token);

    void sendResetPasswordEmail(String to, String token);

    void sendOrderSuccessEmail(String to, String orderCode);
}