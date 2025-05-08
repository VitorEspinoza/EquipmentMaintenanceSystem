package br.com.backend.backend.Security.auth;

import br.com.backend.backend.Entities.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private String expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Account account) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", account.getId());
        claims.put("roles", List.of(account.getRole()));
        return Jwts.builder()
                .claims(claims)
                .subject(account.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + Long.parseLong(expiration) * 1000))
                .signWith(getSigningKey())
                .compact();
    }

    public String generateRefreshToken(Account account) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", account.getId());
        claims.put("roles", List.of(account.getRole()));
        return Jwts.builder()
                .subject(account.getUsername())
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000))
                .signWith(getSigningKey())
                .compact();
    }

    public Boolean validateToken(String token, Account account) {
        final String username = extractUsername(token);
        return (username.equals(account.getUsername()) && !isTokenExpired(token));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}

