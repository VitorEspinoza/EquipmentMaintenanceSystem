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
        Address existingAddres = getByZipcodeAndNumber(dto.getZipcode(), dto.getNumber());
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

    public Address getByZipcodeAndNumber(String zipcode, String number) {
        Optional<Address> address = addressRepository.findByZipcodeAndNumber(zipcode, number);
        return address.orElse(null);
    }
}
