package br.com.backend.backend.Repositories;

import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Exceptions.Custom.ResourceNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);

    Optional<Account> findByEmailAndIdNot(String email, Integer id);
}
