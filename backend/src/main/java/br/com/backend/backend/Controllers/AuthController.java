package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.Auth.AuthRequestDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Services.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ResultViewModel<String>> login(@RequestBody AuthRequestDTO dto) {
        ResponseCookie cookie = authService.login(dto);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ResultViewModel.success("Login successful"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ResultViewModel<String>> logout() {
        ResponseCookie cookie = ResponseCookie.from("access_token", "")
                .path("/")
                .httpOnly(true)
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ResultViewModel.success("Logout successful"));
    }

}
