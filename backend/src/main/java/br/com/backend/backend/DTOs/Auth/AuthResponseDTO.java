package br.com.backend.backend.DTOs.Auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AuthResponseDTO {
    private String message;
    private String role;
}
