package br.com.backend.backend.DTOs.address;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateAddressDTO {
    private String zipcode;
    private String neighbourhood;
    private String street;
    private String city;
    private String state;
    private String number;
    private String complement;
}
