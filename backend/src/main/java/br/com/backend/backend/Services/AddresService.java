package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.address.CreateAddressDTO;
import br.com.backend.backend.Entities.Address;
import br.com.backend.backend.Repositories.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddresService {
    private final AddressRepository addressRepository;

    public Address persistAddress(CreateAddressDTO createAddressDTO) {
        Optional<Address> existingAddress = addressRepository.findByZipcodeAndNumberAndComplement(
                createAddressDTO.getZipcode(),
                createAddressDTO.getNumber(),
                createAddressDTO.getComplement()
        );

        return existingAddress.orElseGet(() -> create(createAddressDTO));

    }

    private Address create(CreateAddressDTO createAddressDTO) {
        Address addressCreate = new Address();
        addressCreate.setZipcode(createAddressDTO.getZipcode());
        addressCreate.setNeighbourhood(createAddressDTO.getNeighbourhood());
        addressCreate.setStreet(createAddressDTO.getStreet());
        addressCreate.setCity(createAddressDTO.getCity());
        addressCreate.setState(createAddressDTO.getState());
        addressCreate.setNumber(createAddressDTO.getNumber());
        addressCreate.setComplement(createAddressDTO.getComplement());

        return addressRepository.save(addressCreate);
    }
}
