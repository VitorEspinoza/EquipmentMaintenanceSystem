package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import br.com.backend.backend.DTOs.Account.CreateAccountDTO;
import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Exceptions.Custom.AccountAlreadyExists;
import br.com.backend.backend.Mappers.AccountMapper;
import br.com.backend.backend.Repositories.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.security.auth.login.AccountException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final PasswordEncoder passwordEncoder;

    public Account getByEmail(String email) {
        return accountRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public Account getById(Integer id) {
        return accountRepository.findById(id).orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public AccountDTO create(CreateAccountDTO dto) {

        if(emailAccountAlreadyInUse(dto.getEmail())) {
            throw new AccountAlreadyExists("email");
        }

        String encryptedPassword = passwordEncoder.encode(dto.getPassword());

        Account accountCreate = new Account(dto.getEmail(), encryptedPassword, dto.getRole());
        Account savedAccount = accountRepository.save(accountCreate);

        return accountMapper.toDto(savedAccount);
    }

    public boolean emailAccountAlreadyInUse(String email) {
        Optional<Account> accountWithEmailExists = accountRepository.findByEmail(email);
        return accountWithEmailExists.isPresent();
    }
}
