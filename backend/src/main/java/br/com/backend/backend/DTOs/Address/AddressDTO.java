package br.com.backend.backend.DTOs.Address;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
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
}
