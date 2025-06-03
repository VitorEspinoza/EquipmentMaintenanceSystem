package br.com.backend.backend.DTOs.Auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.ResponseCookie;

@AllArgsConstructor
@Getter
public class AuthResponse {
    private ResponseCookie cookie;
    private String role;
}
