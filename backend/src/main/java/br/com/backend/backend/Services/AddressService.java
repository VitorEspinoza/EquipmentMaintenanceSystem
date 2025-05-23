package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.Address.CreateAddressDTO;
import br.com.backend.backend.Entities.Address;
import br.com.backend.backend.Repositories.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;

    public Address persistAddress(CreateAddressDTO dto) {
        Address existingAddres = getByZipcode(dto.getZipcode());
        if(existingAddres == null) {
            Address createAddress = new Address(
                    dto.getZipcode(),
                    dto.getNeighbourhood(),
                    dto.getStreet(),
                    dto.getCity(),
                    dto.getState(),
                    dto.getNumber(),
                    dto.getComplement()
            );
            addressRepository.save(createAddress);
            return createAddress;
        }
        return existingAddres;
    }

    public Address getByZipcode(String zipcode) {
        Optional<Address> address = addressRepository.findByZipcode(zipcode);
        return address.orElse(null);
    }
}
