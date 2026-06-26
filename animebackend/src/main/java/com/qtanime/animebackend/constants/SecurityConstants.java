package com.qtanime.animebackend.constants;

public class SecurityConstants {

    private SecurityConstants() {
    }

    // ==========================================
    // JWT SECRET
    // ==========================================

    public static final String JWT_SECRET =

            "QWERTYUIOPASDFGHJKLZXCVBNM123456789"
                    + "QWERTYUIOPASDFGHJKLZXCVBNM123456789"
                    + "QWERTYUIOPASDFGHJKLZXCVBNM123456789";

    // ==========================================
    // ACCESS TOKEN
    // 7 DAYS
    // ==========================================

    public static final long JWT_EXPIRATION =
            604800000L;

    // ==========================================
    // REFRESH TOKEN
    // 30 DAYS
    // ==========================================

    public static final long JWT_REFRESH_EXPIRATION =
            2592000000L;

    // ==========================================
    // TOKEN PREFIX
    // ==========================================

    public static final String TOKEN_PREFIX =
            "Bearer ";

    // ==========================================
    // HEADER
    // ==========================================

    public static final String HEADER_STRING =
            "Authorization";
}