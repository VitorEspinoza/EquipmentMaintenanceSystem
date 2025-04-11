package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.account.CreateAccountDTO;
import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Repositories.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    public Account create(CreateAccountDTO createAccountDTO) {
        if(isEmailAlreadyExist(createAccountDTO.getEmail())) {
            throw new RuntimeException("Email already exist");
        }

        Account accountCreate = Account.create(
                createAccountDTO.getEmail(),
                createAccountDTO.getPassword()
        );

        return accountRepository.save(accountCreate);
    }

    private boolean isEmailAlreadyExist(String email) {
        Optional<Account> account = accountRepository.findByEmail(email);
        return account.isPresent();
    }
}
