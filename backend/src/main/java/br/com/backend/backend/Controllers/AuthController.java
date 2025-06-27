package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import br.com.backend.backend.DTOs.Auth.AuthRequestDTO;
import br.com.backend.backend.DTOs.Auth.AuthResponseDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Services.AuthService;
import br.com.backend.backend.Services.CurrentUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CurrentUserService currentUserService;
    @PostMapping("/login")
    public ResponseEntity<ResultViewModel<AccountDTO>> login(@RequestBody AuthRequestDTO dto) {
        AuthResponseDTO response = authService.login(dto);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, response.getCookie().toString())
                .body(ResultViewModel.success(response.getAccount()));
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

    @GetMapping("/me")
    public ResponseEntity<ResultViewModel<AccountDTO>> login() {
        var userDto = AccountDTO.fromEntity(currentUserService.getCurrentUser());
        return ResponseEntity.ok()
                .body(ResultViewModel.success(userDto));
    }

}
