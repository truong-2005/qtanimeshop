package com.qtanime.animebackend.security.oauth;

import com.qtanime.animebackend.entity.Role;
import com.qtanime.animebackend.entity.User;
import com.qtanime.animebackend.enums.RoleName;
import com.qtanime.animebackend.repository.RoleRepository;
import com.qtanime.animebackend.repository.UserRepository;
import com.qtanime.animebackend.security.jwt.JwtTokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final JwtTokenProvider jwtTokenProvider;

    @Value("${oauth2.redirect.frontend-url}")
    private String frontendRedirectUrl;

    // =========================
    // XỬ LÝ ĐĂNG NHẬP OAUTH2 THÀNH CÔNG
    // =========================

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;

        // Xác định provider: "google" hoặc "facebook"
        String provider = token.getAuthorizedClientRegistrationId();

        OAuth2User oAuth2User = token.getPrincipal();

        // Lấy thông tin user từ provider tương ứng
        OAuth2UserInfo userInfo = extractUserInfo(provider, oAuth2User);

        // Tìm hoặc tạo mới user trong DB
        User user = findOrCreateUser(userInfo, provider);

        // Tạo JWT access token
        String jwt = jwtTokenProvider.generateToken(user);

        // Redirect về frontend kèm token
        response.sendRedirect(frontendRedirectUrl + "?token=" + jwt);
    }

    // =========================
    // TRÍCH XUẤT THÔNG TIN USER THEO PROVIDER
    // =========================

    private OAuth2UserInfo extractUserInfo(String provider, OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        return switch (provider) {

            case "google" -> {
                String id    = (String) attributes.get("sub");
                String email = (String) attributes.get("email");
                String name  = (String) attributes.get("name");
                String avatar = (String) attributes.get("picture");
                yield new OAuth2UserInfo(id, email, name, avatar);
            }

            case "facebook" -> {
                String id    = (String) attributes.get("id");
                String email = (String) attributes.get("email");
                String name  = (String) attributes.get("name");

                // Avatar từ Facebook nằm trong object lồng nhau
                String avatar = null;
                Object pictureObj = attributes.get("picture");
                if (pictureObj instanceof Map<?, ?> pictureMap) {
                    Object dataObj = pictureMap.get("data");
                    if (dataObj instanceof Map<?, ?> dataMap) {
                        avatar = (String) dataMap.get("url");
                    }
                }
                yield new OAuth2UserInfo(id, email, name, avatar);
            }

            default -> throw new RuntimeException("Provider không được hỗ trợ: " + provider);
        };
    }

    // =========================
    // TÌM HOẶC TẠO MỚI USER
    // =========================

    private User findOrCreateUser(OAuth2UserInfo userInfo, String provider) {

        // 1. Tìm theo email trước
        return userRepository.findByEmail(userInfo.email())
                .map(existingUser -> {
                    // Cập nhật avatar nếu chưa có
                    if (existingUser.getAvatar() == null && userInfo.avatar() != null) {
                        existingUser.setAvatar(userInfo.avatar());
                    }
                    // Cập nhật provider nếu chưa có
                    if (existingUser.getProvider() == null) {
                        existingUser.setProvider(provider);
                        existingUser.setProviderId(userInfo.providerId());
                    }
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {

                    // 2. Tạo user mới
                    Role role = roleRepository.findByName(RoleName.CUSTOMER)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy role CUSTOMER"));

                    // Tạo username duy nhất từ provider + id
                    String username = provider + "_" + userInfo.providerId();

                    User newUser = User.builder()
                            .email(userInfo.email())
                            .username(username)
                            .fullName(userInfo.name())
                            .avatar(userInfo.avatar())
                            .provider(provider)
                            .providerId(userInfo.providerId())
                            .enabled(true)
                            .role(role)
                            .build();

                    return userRepository.save(newUser);
                });
    }

    // =========================
    // RECORD CHỨA THÔNG TIN USER TỪ OAUTH2
    // =========================

    private record OAuth2UserInfo(
            String providerId,
            String email,
            String name,
            String avatar
    ) {}
}