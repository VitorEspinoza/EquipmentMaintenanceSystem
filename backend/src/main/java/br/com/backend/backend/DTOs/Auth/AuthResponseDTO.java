package br.com.backend.backend.DTOs.Auth;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.ResponseCookie;

@AllArgsConstructor
@Getter
public class AuthResponseDTO {
    private ResponseCookie cookie;
    private AccountDTO account;
}
