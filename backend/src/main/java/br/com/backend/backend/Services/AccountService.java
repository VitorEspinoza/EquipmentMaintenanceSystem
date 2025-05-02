package br.com.backend.backend.Services;

import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Repositories.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    public Account getByEmail(String email) {
        return accountRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Account not found"));
    }
}
