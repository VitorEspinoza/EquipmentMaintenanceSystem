package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.Auth.AuthRequestDTO;
import br.com.backend.backend.DTOs.Auth.AuthResponseDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Services.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ResultViewModel<AuthResponseDTO>> login(@RequestBody AuthRequestDTO dto) {
        ResponseCookie cookie = authService.login(dto);
        log.info("Generated cookie: {}", cookie); // <-- se explodir aqui, o problema está no toString()

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new ResultViewModel<>(new AuthResponseDTO("Login successful")));
    }

}
