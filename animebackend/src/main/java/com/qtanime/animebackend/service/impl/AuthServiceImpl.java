package com.qtanime.animebackend.service.impl;

import com.qtanime.animebackend.dto.auth.*;
import com.qtanime.animebackend.entity.RefreshToken;
import com.qtanime.animebackend.entity.Role;
import com.qtanime.animebackend.entity.User;
import com.qtanime.animebackend.enums.RoleName;
import com.qtanime.animebackend.enums.TokenType;
import com.qtanime.animebackend.exception.BadRequestException;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.RefreshTokenRepository;
import com.qtanime.animebackend.repository.RoleRepository;
import com.qtanime.animebackend.repository.UserRepository;
import com.qtanime.animebackend.security.jwt.JwtTokenProvider;
import com.qtanime.animebackend.service.AuthService;
import com.qtanime.animebackend.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final RefreshTokenRepository refreshTokenRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtTokenProvider jwtTokenProvider;

    private final AuthenticationManager authenticationManager;

    private final MailService mailService;

    // =========================
    // USER REGISTER
    // =========================

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Tên đăng nhập đã tồn tại");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã tồn tại");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Số điện thoại đã tồn tại");
        }

        Role role = roleRepository.findByName(RoleName.CUSTOMER)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Không tìm thấy role"));

        User user = User.builder()
                .username(request.getUsername())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .gender(request.getGender())
                .enabled(true)
                .role(role)
                .build();

        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateToken(user);

        String refreshToken = createRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    // =========================
    // USER LOGIN
    // =========================

    @Override
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsernameOrEmail(
                        request.getUsernameOrEmail(),
                        request.getUsernameOrEmail()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Tài khoản không tồn tại"));

        String accessToken = jwtTokenProvider.generateToken(user);

        String refreshToken = createRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    // =========================
    // USER LOGOUT
    // =========================

    @Override
    public void logout(String token) {

        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(token)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Refresh token không tồn tại"));

        refreshToken.setRevoked(true);

        refreshTokenRepository.save(refreshToken);
    }

    // =========================
    // ADMIN REGISTER
    // =========================

    @Override
    public AuthResponse adminRegister(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Tên đăng nhập đã tồn tại");
        }

        Role role = roleRepository.findByName(RoleName.ADMIN)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Không tìm thấy role"));

        User user = User.builder()
                .username(request.getUsername())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .gender(request.getGender())
                .enabled(true)
                .role(role)
                .build();

        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateToken(user);

        String refreshToken = createRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    // =========================
    // ADMIN LOGIN
    // =========================

    @Override
    public AuthResponse adminLogin(LoginRequest request) {

        AuthResponse response = login(request);

        User user = userRepository.findByUsernameOrEmail(
                        request.getUsernameOrEmail(),
                        request.getUsernameOrEmail()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Không tìm thấy user"));

        if (!user.getRole().getName().equals(RoleName.ADMIN)) {
            throw new BadRequestException("Bạn không phải admin");
        }

        return response;
    }

    // =========================
    // ADMIN LOGOUT
    // =========================

    @Override
    public void adminLogout(String token) {

        logout(token);
    }

    // =========================
    // GOOGLE LOGIN
    // =========================

    @Override
    public AuthResponse loginWithGoogle(String googleToken) {

        throw new UnsupportedOperationException(
                "Google login sẽ xử lý bằng OAuth2");
    }

    // =========================
    // REFRESH TOKEN
    // =========================

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {

        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(request.getRefreshToken())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Refresh token không tồn tại"));

        if (Boolean.TRUE.equals(refreshToken.getRevoked())) {
            throw new BadRequestException("Refresh token đã bị thu hồi");
        }

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Refresh token đã hết hạn");
        }

        User user = refreshToken.getUser();

        String accessToken = jwtTokenProvider.generateToken(user);

        return buildAuthResponse(
                user,
                accessToken,
                refreshToken.getToken()
        );
    }

    // =========================
    // FORGOT PASSWORD
    // =========================

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Email không tồn tại"));

        String token = UUID.randomUUID().toString();

        mailService.sendResetPasswordEmail(
                user.getEmail(),
                token
        );
    }

    // =========================
    // RESET PASSWORD
    // =========================

    @Override
    public void resetPassword(ResetPasswordRequest request) {

        throw new UnsupportedOperationException(
                "Reset password logic");
    }

    // =========================
    // VERIFY EMAIL
    // =========================

    @Override
    public void verifyEmail(String token) {

        throw new UnsupportedOperationException(
                "Verify email logic");
    }

    // =========================
    // CREATE REFRESH TOKEN
    // =========================

    private String createRefreshToken(User user) {

        String token = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .tokenType(TokenType.REFRESH_TOKEN)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .user(user)
                .build();

        refreshTokenRepository.save(refreshToken);

        return token;
    }

    // =========================
    // BUILD RESPONSE
    // =========================

    private AuthResponse buildAuthResponse(
            User user,
            String accessToken,
            String refreshToken
    ) {

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().getName().name())
                .build();
    }
}