package br.com.backend.backend.Security.auth;

import br.com.backend.backend.Entities.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import static br.com.backend.backend.Security.SecurityConstants.*;

@Component
@RequiredArgsConstructor
public class AuthHelper {
    private final JwtUtils jwtUtils;
    // private final RefreshTokenService refreshTokenService;

    public ResponseCookie generateAuthResponse(
            Account account
    ) {
        JwtPayload payload = new JwtPayload(
                account.getId().toString(),
                account.getEmail(),
                "ROLE_"+account.getRole()
        );

        String accessToken = jwtUtils.generateToken(payload);
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
