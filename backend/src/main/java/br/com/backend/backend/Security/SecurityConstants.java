package br.com.backend.backend.Security;

public final class SecurityConstants {

    private SecurityConstants() {}

    public static final String ACCESS_TOKEN_COOKIE = "access_token";
    public static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    public static final int ACCESS_TOKEN_EXPIRATION_SECONDS = 3600;          // 1 hour
    public static final int REFRESH_TOKEN_EXPIRATION_SECONDS = 604_800;     // 7 days

    public static final String BEARER_PREFIX = "Bearer ";

}
