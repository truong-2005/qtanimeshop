package com.qtanime.animebackend.service;

import com.qtanime.animebackend.dto.auth.AuthResponse;
import com.qtanime.animebackend.dto.auth.ForgotPasswordRequest;
import com.qtanime.animebackend.dto.auth.LoginRequest;
import com.qtanime.animebackend.dto.auth.RefreshTokenRequest;
import com.qtanime.animebackend.dto.auth.RegisterRequest;
import com.qtanime.animebackend.dto.auth.ResetPasswordRequest;

public interface AuthService {

    // =========================
    // USER AUTH
    // =========================

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void logout(String token);

    // =========================
    // ADMIN AUTH
    // =========================

    AuthResponse adminRegister(RegisterRequest request);

    AuthResponse adminLogin(LoginRequest request);

    void adminLogout(String token);

    // =========================
    // GOOGLE LOGIN
    // =========================

    AuthResponse loginWithGoogle(String googleToken);

    // =========================
    // TOKEN
    // =========================

    AuthResponse refreshToken(RefreshTokenRequest request);

    // =========================
    // PASSWORD
    // =========================

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    // =========================
    // EMAIL VERIFY
    // =========================

    void verifyEmail(String token);
}