package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import br.com.backend.backend.DTOs.Account.CreateAccountDTO;
import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Exceptions.Custom.AccountAlreadyExists;
import br.com.backend.backend.Exceptions.Custom.AccountNotFoundException;
import br.com.backend.backend.Repositories.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public Account getByEmail(String email) {
        return accountRepository.findByEmail(email).orElseThrow(() -> new AccountNotFoundException("Account wiht email not found"));
    }

    public Account getById(Integer id) {
        return accountRepository.findById(id).orElseThrow(() -> new AccountNotFoundException("Account wiht id not found"));
    }

    public AccountDTO create(CreateAccountDTO dto) {

        if(emailAccountAlreadyInUse(dto.getEmail(), null)) {
            throw new AccountAlreadyExists("email");
        }

        String encryptedPassword = passwordEncoder.encode(dto.getPassword());

        Account accountCreate = new Account(dto.getEmail(), encryptedPassword, dto.getRole());
        Account savedAccount = accountRepository.save(accountCreate);

        return AccountDTO.fromEntity(savedAccount);
    }

    public boolean emailAccountAlreadyInUse(String email, Integer id) {
        return Optional.ofNullable(id)
                .map(existingId -> accountRepository.findByEmailAndIdNot(email, id))
                .orElseGet(() ->  accountRepository.findByEmail(email))
                .isPresent();
    }
}
