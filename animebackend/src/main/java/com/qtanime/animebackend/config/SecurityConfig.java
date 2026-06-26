package com.qtanime.animebackend.config;

import com.qtanime.animebackend.security.jwt.JwtAuthenticationFilter;
import com.qtanime.animebackend.security.jwt.JwtEntryPoint;
import com.qtanime.animebackend.security.oauth.OAuth2LoginSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final JwtEntryPoint jwtEntryPoint;

    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    // ==========================================
    // SECURITY FILTER CHAIN
    // ==========================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // ==========================================
                // CSRF
                // ==========================================

                .csrf(csrf -> csrf.disable())

                // ==========================================
                // CORS
                // ==========================================

                .cors(cors -> {
                })

                // ==========================================
                // SESSION
                // ==========================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // ==========================================
                // EXCEPTION
                // ==========================================

                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(
                                jwtEntryPoint
                        )
                )

                // ==========================================
                // AUTHORIZE
                // ==========================================

                .authorizeHttpRequests(auth -> auth

                        // ==========================================
                        // SWAGGER
                        // ==========================================

                        .requestMatchers(

                                "/swagger-ui/**",

                                "/swagger-ui.html",

                                "/v3/api-docs/**",

                                "/error"

                        ).permitAll()

                        // ==========================================
                        // AUTH PUBLIC API
                        // ==========================================

                        .requestMatchers(
                                HttpMethod.POST,

                                "/api/login",

                                "/api/register",

                                "/api/logout",

                                "/api/refresh-token",

                                "/api/forgot-password",

                                "/api/reset-password",

                                "/api/auth/admin/login",

                                "/api/auth/admin/register",

                                "/api/admin/logout"

                        ).permitAll()

                        // ==========================================
                        // GOOGLE LOGIN
                        // ==========================================

                        .requestMatchers(

                                "/oauth2/**",

                                "/login/oauth2/**"

                        ).permitAll()

                        // ==========================================
                        // PUBLIC GET API
                        // ==========================================

                        .requestMatchers(
                                HttpMethod.GET,

                                "/uploads/**",

                                "/api/products/**",

                                "/api/categories/**",

                                "/api/brands/**",

                                "/api/posts/**",

                                "/api/banners/**",

                                "/api/topics/**",

                                "/api/menus/**",

                                "/api/settings/**",
                                "/api/users/**"

                        ).permitAll()

                        // ==========================================
                        // VNPAY
                        // ==========================================

                        .requestMatchers(

                                "/api/vnpay/**"

                        ).permitAll()

                        // ==========================================
                        // CHATBOT
                        // ==========================================

                        .requestMatchers(

                                "/api/chatbot/**"

                        ).permitAll()

                        // ==========================================
                        // DASHBOARD ADMIN
                        // ==========================================

                        .requestMatchers(

                                "/api/dashboard/**"

                        ).hasRole("ADMIN")

                        // ==========================================
                        // PRODUCT ADMIN
                        // ==========================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/products/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/products/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/products/**"
                        ).hasRole("ADMIN")

                        // ==========================================
                        // CATEGORY ADMIN
                        // ==========================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        // ==========================================
                        // BRAND ADMIN
                        // ==========================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/brands/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/brands/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/brands/**"
                        ).hasRole("ADMIN")

                        // ==========================================
                        // USER API
                        // ==========================================

                        .requestMatchers(

                                "/api/users/me/**",

                                "/api/cart/**",

                                "/api/orders/**",

                                "/api/payments/**",

                                "/api/uploads/**"

                        ).hasAnyRole(
                                "ADMIN",
                                "CUSTOMER"
                        )

                        // ==========================================
                        // OTHER
                        // ==========================================

                        .anyRequest()
                        .authenticated()
                )

                // ==========================================
                // GOOGLE OAUTH2
                // ==========================================

                .oauth2Login(oauth ->
                        oauth.successHandler(
                                oAuth2LoginSuccessHandler
                        )
                );

        // ==========================================
        // JWT FILTER
        // ==========================================

        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }

    // ==========================================
    // AUTHENTICATION MANAGER
    // ==========================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }
}