package br.com.backend.backend.Services.Interfaces;

import br.com.backend.backend.DTOs.Auth.AuthRequestDTO;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;

public interface AuthService {
    Authentication getAuthentication();
    ResponseCookie login(AuthRequestDTO authRequestDTO);
}
