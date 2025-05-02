package br.com.backend.backend.Repositories;

import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Exceptions.Custom.ResourceNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);
}
