package com.qtanime.animebackend.constants;

public class AppConstants {

    private AppConstants() {
    }

    // =========================
    // PAGINATION
    // =========================

    public static final int DEFAULT_PAGE = 0;

    public static final int DEFAULT_SIZE = 10;

    public static final String DEFAULT_SORT_BY = "createdAt";

    public static final String DEFAULT_SORT_DIRECTION = "desc";

    // =========================
    // FILE UPLOAD
    // =========================

    public static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    public static final String UPLOAD_FOLDER = "uploads/";

    // =========================
    // PRODUCT
    // =========================

    public static final int LOW_STOCK_QUANTITY = 5;

    // =========================
    // API PREFIX
    // =========================

    public static final String API_PREFIX = "/api";

    // =========================
    // SWAGGER
    // =========================

    public static final String SWAGGER_URL = "/swagger-ui/index.html";

    // =========================
    // EMAIL
    // =========================

    public static final String EMAIL_SUBJECT_VERIFY =
            "Xác thực tài khoản Figure Anime Store";

    public static final String EMAIL_SUBJECT_RESET_PASSWORD =
            "Đặt lại mật khẩu Figure Anime Store";

    // =========================
    // PAYMENT
    // =========================

    public static final String PAYMENT_SUCCESS = "Thanh toán thành công";

    public static final String PAYMENT_FAILED = "Thanh toán thất bại";

    // =========================
    // ROLE
    // =========================

    public static final String ROLE_ADMIN = "ADMIN";

    public static final String ROLE_CUSTOMER = "CUSTOMER";
}