package br.com.backend.backend.DTOs.Client;

import br.com.backend.backend.DTOs.Address.AddressDTO;
import br.com.backend.backend.Entities.Client;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ClientDTO {

    private Integer id;
    private Integer idAccount;
    private String name;
    private String email;
    private String role;
    private String phone;
    private AddressDTO address;

    public static ClientDTO fromEntity(Client client) {
        return new ClientDTO(
                client.getId(),
                client.getAccount().getId(),
                client.getName(),
                client.getAccount().getEmail(),
                client.getAccount().getRole(),
                client.getPhone(),
                AddressDTO.fromEntity(client.getAddress())
        );
    }
}
