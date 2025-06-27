package br.com.backend.backend.Repositories;

import br.com.backend.backend.Entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    Optional<Address> findByZipcode(String zipcode);

    Optional<Address> findByZipcodeAndNumber(String zipcode, String number);
}
