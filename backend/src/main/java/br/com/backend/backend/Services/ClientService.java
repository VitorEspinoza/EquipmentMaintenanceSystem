package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import br.com.backend.backend.DTOs.Account.CreateAccountDTO;
import br.com.backend.backend.DTOs.Auth.AuthRequestDTO;
import br.com.backend.backend.DTOs.Client.ClientCreateResult;
import br.com.backend.backend.DTOs.Client.ClientDTO;
import br.com.backend.backend.DTOs.Client.CreateClientDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Entities.Address;
import br.com.backend.backend.Entities.Client;
import br.com.backend.backend.Exceptions.Custom.ClientCreationInvalidException;
import br.com.backend.backend.ExternalServices.Zipcode.ViaCepZipCodeValidator;
import br.com.backend.backend.ExternalServices.Zipcode.ZipCodeValidator;
import br.com.backend.backend.Repositories.ClientRepository;
import br.com.backend.backend.Services.Interfaces.ClientPasswordEmailService;
import br.com.backend.backend.Utils.PasswordGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    private final AccountService accountService;
    private final AddressService addressService;
    private final ClientPasswordEmailService clientPasswordEmailService;
    private final AuthService authService;
    private final ZipCodeValidator zipCodeValidator;

    @Transactional
    public ClientCreateResult create(CreateClientDTO dto) {
        if(!invalidClientCreationList(dto).isEmpty()) {
            throw new ClientCreationInvalidException(invalidClientCreationList(dto));
        }

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

        clientPasswordEmailService.sendPasswordToClient(dto, randomPassword);

        ClientDTO clientDTO = ClientDTO.fromEntity(clientCreated);

        ResponseCookie cookie = authService.login(new AuthRequestDTO(clientCreated.getAccount().getEmail(), randomPassword)).getCookie();

       return new ClientCreateResult(
                ResultViewModel.success(clientDTO),
                cookie
        );
    }

    private List<String> invalidClientCreationList(CreateClientDTO dto) {
        List<String> validations = new ArrayList<>();

        if (clientRepository.findClientByCpf(dto.getCpf()).isPresent()) {
            validations.add("CPF already in use.");
        }

        if (clientRepository.findClientByPhone(dto.getPhone()).isPresent()) {
            validations.add("Phone already in use.");
        }

        if(clientRepository.findClientByAccount_Email(dto.getEmail()).isPresent()) {
            validations.add("Email already in use.");
        }

        if(!zipCodeValidator.isValidZipCode(dto.getAddress().getZipcode())) {
            validations.add("Zipcode not valid.");
        }

        return validations;
    }

}
