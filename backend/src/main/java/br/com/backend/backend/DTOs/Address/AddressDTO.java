package br.com.backend.backend.DTOs.Address;

import br.com.backend.backend.Entities.Address;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class AddressDTO {
    private Integer id;
    private String zipcode;
    private String neighbourhood;
    private String street;
    private String city;
    private String state;
    private String number;
    private String complement;
    
    public static AddressDTO fromEntity(Address address) {
        return new AddressDTO(
                address.getId(),
                address.getZipcode(),
                address.getNeighbourhood(),
                address.getStreet(),
                address.getCity(),
                address.getState(),
                address.getNumber(),
                address.getComplement()
        );
    }
}
