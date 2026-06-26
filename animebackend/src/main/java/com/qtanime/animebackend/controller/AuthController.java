package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.dto.auth.*;
import com.qtanime.animebackend.dto.common.ApiResponse;
import com.qtanime.animebackend.dto.common.MessageResponse;
import com.qtanime.animebackend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    // =========================
    // USER REGISTER
    // =========================

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        return ApiResponse.<AuthResponse>builder()
                .status(200)
                .message("Đăng ký thành công")
                .data(authService.register(request))
                .build();
    }

    // =========================
    // USER LOGIN
    // =========================

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        return ApiResponse.<AuthResponse>builder()
                .status(200)
                .message("Đăng nhập thành công")
                .data(authService.login(request))
                .build();
    }

    // =========================
    // USER LOGOUT
    // =========================

    @PostMapping("/logout")
    public ApiResponse<MessageResponse> logout(
            @RequestParam String refreshToken
    ) {

        authService.logout(refreshToken);

        return ApiResponse.<MessageResponse>builder()
                .status(200)
                .message("Đăng xuất thành công")
                .data(new MessageResponse("Logout success"))
                .build();
    }

    // =========================
    // ADMIN REGISTER
    // =========================

    @PostMapping("/auth/admin/register")
    public ApiResponse<AuthResponse> adminRegister(
            @Valid @RequestBody RegisterRequest request
    ) {

        return ApiResponse.<AuthResponse>builder()
                .status(200)
                .message("Đăng ký admin thành công")
                .data(authService.adminRegister(request))
                .build();
    }

    // =========================
    // ADMIN LOGIN
    // =========================

    @PostMapping("/auth/admin/login")
    public ApiResponse<AuthResponse> adminLogin(
            @Valid @RequestBody LoginRequest request
    ) {

        return ApiResponse.<AuthResponse>builder()
                .status(200)
                .message("Đăng nhập admin thành công")
                .data(authService.adminLogin(request))
                .build();
    }

    // =========================
    // ADMIN LOGOUT
    // =========================

    @PostMapping("/admin/logout")
    public ApiResponse<MessageResponse> adminLogout(
            @RequestParam String refreshToken
    ) {

        authService.adminLogout(refreshToken);

        return ApiResponse.<MessageResponse>builder()
                .status(200)
                .message("Đăng xuất admin thành công")
                .data(new MessageResponse("Admin logout success"))
                .build();
    }

    // =========================
    // REFRESH TOKEN
    // =========================

    @PostMapping("/refresh-token")
    public ApiResponse<AuthResponse> refreshToken(
            @RequestBody RefreshTokenRequest request
    ) {

        return ApiResponse.<AuthResponse>builder()
                .status(200)
                .message("Refresh token thành công")
                .data(authService.refreshToken(request))
                .build();
    }

    // =========================
    // FORGOT PASSWORD
    // =========================

    @PostMapping("/forgot-password")
    public ApiResponse<MessageResponse> forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) {

        authService.forgotPassword(request);

        return ApiResponse.<MessageResponse>builder()
                .status(200)
                .message("Đã gửi email reset password")
                .data(new MessageResponse("Success"))
                .build();
    }

    // =========================
    // RESET PASSWORD
    // =========================

    @PostMapping("/reset-password")
    public ApiResponse<MessageResponse> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {

        authService.resetPassword(request);

        return ApiResponse.<MessageResponse>builder()
                .status(200)
                .message("Đổi mật khẩu thành công")
                .data(new MessageResponse("Success"))
                .build();
    }

    // =========================
    // GOOGLE LOGIN
    // =========================

    @GetMapping("/oauth2/login/google")
    public String googleLogin() {

        return "/oauth2/authorization/google";
    }
}