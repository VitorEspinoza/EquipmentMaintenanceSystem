package br.com.backend.backend.DTOs.Client;

import br.com.backend.backend.DTOs.CreateAddressDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateClientDTO {
    private String cpf;
    private String name;
    private String phone;
    private String email;
    private CreateAddressDTO address;
}
