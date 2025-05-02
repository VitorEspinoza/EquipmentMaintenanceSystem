package br.com.backend.backend.Security.auth;

import br.com.backend.backend.DTOs.Auth.AuthResponseDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Entities.Account;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import static br.com.backend.backend.Security.SecurityConstants.*;

@Component
public class AuthHelper {
    private final JwtUtils jwtUtils;
    // private final RefreshTokenService refreshTokenService;

    public AuthHelper(final JwtUtils jwtUtils /*, final RefreshTokenService refreshTokenService*/) {
        this.jwtUtils = jwtUtils;
        // this.refreshTokenService = refreshTokenService;
    }

    public ResponseCookie generateAuthResponse(
            Account account
    ) {
        String accessToken = jwtUtils.generateToken(account);
        // String refreshToken = jwtUtils.generateRefreshToken(account);

        // refreshTokenService.saveRefreshToken(account.getUsername(), refreshToken);

        // ResponseCookie refreshCookie = buildCookie(REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_TOKEN_EXPIRATION_SECONDS);

        return buildCookie(ACCESS_TOKEN_COOKIE, accessToken, ACCESS_TOKEN_EXPIRATION_SECONDS);
    }

    private ResponseCookie buildCookie(String name, String value, int maxAgeSeconds) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAgeSeconds)
                .sameSite("Strict")
                .build();
    }
}
