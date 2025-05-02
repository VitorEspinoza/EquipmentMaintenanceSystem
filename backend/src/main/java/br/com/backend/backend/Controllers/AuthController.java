package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.Auth.AuthRequestDTO;
import br.com.backend.backend.DTOs.Auth.AuthResponseDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ResultViewModel<AuthResponseDTO>> login(@RequestBody AuthRequestDTO dto) {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authService.login(dto).toString())
                // .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(new ResultViewModel<>(new AuthResponseDTO("Login successful")));
    }
}
