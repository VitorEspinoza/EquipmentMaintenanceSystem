package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import br.com.backend.backend.DTOs.Account.CreateAccountDTO;
import br.com.backend.backend.DTOs.Client.ClientDTO;
import br.com.backend.backend.DTOs.Client.CreateClientDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Entities.Address;
import br.com.backend.backend.Entities.Client;
import br.com.backend.backend.Exceptions.Custom.AccountAlreadyExists;
import br.com.backend.backend.Repositories.ClientRepository;
import br.com.backend.backend.Utils.PasswordGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    private final AccountService accountService;
    private final AddressService addressService;

    public ResultViewModel<ClientDTO> create(CreateClientDTO dto) {
        String randomPassword = PasswordGenerator.generateRandomPassword();
        CreateAccountDTO account = new CreateAccountDTO(
                dto.getEmail(),
                randomPassword,
                "CLIENT"
        );
        AccountDTO accountDTO = accountService.create(account);
        Account accountCreated = accountService.getById(accountDTO.getId());
        Address address = addressService.persistAddress(dto.getAddress());
        Client client = new Client(
                accountCreated,
                address,
                dto.getName(),
                dto.getCpf(),
                dto.getPhone()
        );
        Client clientCreated = clientRepository.save(client);
        return ResultViewModel.success(new ClientDTO());
    }
}
