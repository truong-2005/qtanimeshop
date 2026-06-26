package com.qtanime.animebackend.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    private final UserDetailsService userDetailsService;

    private static final List<String> PUBLIC_URLS = List.of(

            "/swagger-ui/**",

            "/swagger-ui.html",

            "/v3/api-docs/**",

            "/api/login",

            "/api/register",

            "/api/logout",

            "/api/refresh-token",

            "/api/forgot-password",

            "/api/reset-password",

            "/api/auth/admin/login",

            "/api/auth/admin/register",

            "/api/admin/logout",

            "/oauth2/**",

            "/login/oauth2/**"
    );

    private final AntPathMatcher pathMatcher =
            new AntPathMatcher();

    @Override
    protected void doFilterInternal(

            HttpServletRequest request,

            HttpServletResponse response,

            FilterChain filterChain

    ) throws ServletException, IOException {

        String path = request.getServletPath();

        // ==========================================
        // PUBLIC API
        // ==========================================

        boolean isPublic = PUBLIC_URLS.stream()
                .anyMatch(pattern ->
                        pathMatcher.match(pattern, path)
                );

        if (isPublic) {

            filterChain.doFilter(request, response);

            return;
        }

        try {

            // ==========================================
            // GET TOKEN
            // ==========================================

            String jwt = getJwtFromRequest(request);

            log.debug("JWT token present: {}", StringUtils.hasText(jwt));

            // ==========================================
            // VALID TOKEN
            // ==========================================

            if (

                    StringUtils.hasText(jwt)
                            && jwtTokenProvider.validateToken(jwt)

            ) {

                String username =
                        jwtTokenProvider.getUsernameFromToken(jwt);

                log.debug("Authenticating JWT user: {}", username);

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(
                                username
                        );

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(

                                userDetails,

                                null,

                                userDetails.getAuthorities()
                        );

                authentication.setDetails(

                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

                log.debug("JWT authentication succeeded for user: {}", username);
            }

        } catch (UsernameNotFoundException exception) {

            log.warn("JWT authentication failed: user not found", exception);
        }

        filterChain.doFilter(request, response);
    }

    // ==========================================
    // GET TOKEN FROM HEADER
    // ==========================================

    private String getJwtFromRequest(
            HttpServletRequest request
    ) {

        String bearerToken =
                request.getHeader("Authorization");

        if (

                StringUtils.hasText(bearerToken)
                        && bearerToken.startsWith("Bearer ")

        ) {

            return bearerToken.substring(7);
        }

        return null;
    }
}
