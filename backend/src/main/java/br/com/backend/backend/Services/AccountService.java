package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import br.com.backend.backend.DTOs.Account.CreateAccountDTO;
import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Exceptions.Custom.AccountAlreadyExists;
import br.com.backend.backend.Mappers.AccountMapper;
import br.com.backend.backend.Repositories.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountException;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;

    public Account getByEmail(String email) {
        return accountRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public AccountDTO create(CreateAccountDTO dto) {
        Account accountWithEmailExists = getByEmail(dto.getEmail());

        if(accountWithEmailExists != null) {
            throw new AccountAlreadyExists("email");
        }

        Account accountCreate = new Account(dto.getEmail(), dto.getPassword(), dto.getRole());
        Account savedAccount = accountRepository.save(accountCreate);

        return accountMapper.toDto(savedAccount);
    }
}
