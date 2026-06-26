package com.qtanime.animebackend.security.jwt;

import com.qtanime.animebackend.constants.SecurityConstants;
import com.qtanime.animebackend.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // ==========================================
    // SECRET KEY
    // ==========================================

    private final SecretKey key = Keys.hmacShaKeyFor(
            SecurityConstants.JWT_SECRET.getBytes()
    );

    // ==========================================
    // GENERATE ACCESS TOKEN
    // ==========================================

    public String generateToken(User user) {

        Date now = new Date();

        Date expiryDate = new Date(

                now.getTime()
                        + SecurityConstants.JWT_EXPIRATION
        );

        return Jwts.builder()

                .subject(user.getUsername())

                .claim(
                        "role",
                        user.getRole().getName().name()
                )

                .claim(
                        "email",
                        user.getEmail()
                )

                .issuedAt(now)

                .expiration(expiryDate)

                .signWith(key)

                .compact();
    }

    // ==========================================
    // GENERATE REFRESH TOKEN
    // ==========================================

    public String generateRefreshToken(User user) {

        Date now = new Date();

        Date expiryDate = new Date(

                now.getTime()
                        + SecurityConstants.JWT_REFRESH_EXPIRATION
        );

        return Jwts.builder()

                .subject(user.getUsername())

                .issuedAt(now)

                .expiration(expiryDate)

                .signWith(key)

                .compact();
    }

    // ==========================================
    // GET USERNAME
    // ==========================================

    public String getUsernameFromToken(
            String token
    ) {

        Claims claims = Jwts.parser()

                .verifyWith(key)

                .build()

                .parseSignedClaims(token)

                .getPayload();

        return claims.getSubject();
    }

    // ==========================================
    // VALIDATE TOKEN
    // ==========================================

    public boolean validateToken(
            String token
    ) {

        try {

            Jwts.parser()

                    .verifyWith(key)

                    .build()

                    .parseSignedClaims(token);

            return true;

        } catch (ExpiredJwtException exception) {

            System.out.println(
                    "JWT hết hạn"
            );

        } catch (JwtException exception) {

            System.out.println(
                    "JWT không hợp lệ"
            );

        } catch (IllegalArgumentException exception) {

            System.out.println(
                    "JWT rỗng"
            );
        }

        return false;
    }
}