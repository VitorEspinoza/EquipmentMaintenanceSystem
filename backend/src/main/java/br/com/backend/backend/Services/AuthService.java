package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import br.com.backend.backend.DTOs.Auth.AuthRequestDTO;
import br.com.backend.backend.DTOs.Auth.AuthResponseDTO;
import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Exceptions.Custom.InactiveAccountException;
import br.com.backend.backend.Security.auth.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AccountService accountService;
    private final AuthHelper authHelper;

    public AuthResponseDTO login(AuthRequestDTO authRequestDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequestDTO.getEmail(), authRequestDTO.getPassword())
        );

        Account account = accountService.getByEmail(authRequestDTO.getEmail());

        if(!account.getActive()) {
            throw new InactiveAccountException("This account is inactive.");
        }

        return new AuthResponseDTO(
                authHelper.generateAuthResponse(account),
                AccountDTO.fromEntity(account)
        );
    }
}
