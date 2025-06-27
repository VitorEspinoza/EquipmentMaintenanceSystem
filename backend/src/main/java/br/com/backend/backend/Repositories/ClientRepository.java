package br.com.backend.backend.Repositories;

import br.com.backend.backend.Entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {
    Optional<Client> findClientByAccount_Id(Integer id);
    Optional<Client> findClientByCpf(String cpf);
    Optional<Client> findClientByPhone(String phone);
    Optional<Client> findClientByAccount_Email(String accountEmail);
}
