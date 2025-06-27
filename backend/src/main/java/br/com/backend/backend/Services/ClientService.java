package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import br.com.backend.backend.DTOs.Account.CreateAccountDTO;
import br.com.backend.backend.DTOs.Auth.AuthRequestDTO;
import br.com.backend.backend.DTOs.Auth.AuthResponseDTO;
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
import org.apache.tomcat.util.bcel.Const;
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
    public AuthResponseDTO create(CreateClientDTO dto) {
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
        
       return authService.login(new AuthRequestDTO(clientCreated.getAccount().getEmail(), randomPassword));
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

        if (!isValidBrazilianPhone(dto.getPhone())) {
            validations.add("Invalid phone number.");
        }

        return validations;
    }

    private boolean isValidBrazilianPhone(String phone) {
        if (phone == null || phone.isBlank()) {
            return false;
        }

        String digits = phone.replaceAll("\\D", "");

        if (digits.length() < 10 || digits.length() > 11) {
            return false;
        }

        String ddd = digits.substring(0, 2);
        String number = digits.substring(2);

        if (!isValidDDD(ddd)) {
            return false;
        }

        if (number.length() == 9) {
            return number.startsWith("9") && number.matches("9\\d{8}");
        }
        else if (number.length() == 8) {
            return number.matches("[2-5]\\d{7}");
        }

        return false;
    }

    private boolean isValidDDD(String ddd) {
        String[] validDDDs = {
                "11", "12", "13", "14", "15", "16", "17", "18", "19",
                "21", "22", "24", "27", "28", "31", "32", "33", "34", "35", "37", "38",
                "41", "42", "43", "44", "45", "46", "47", "48", "49",
                "51", "53", "54", "55", "61", "62", "63", "64", "65", "66", "67", "68", "69",
                "71", "73", "74", "75", "77", "79", "81", "82", "83", "84", "85", "86", "87", "88", "89",
                "91", "92", "93", "94", "95", "96", "97", "98", "99"
        };

        return Arrays.asList(validDDDs).contains(ddd);
    }

}
