package br.com.backend.backend.ExternalServices.Zipcode;

import br.com.backend.backend.DTOs.Address.CreateAddressDTO;
import br.com.backend.backend.ExternalServices.Zipcode.models.ViaCepResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Component
public class ViaCepZipCodeValidator implements ZipCodeValidator {
    private static final String VIACEP_URL = "https://viacep.com.br/ws/{cep}/json/";

    @Override
    public boolean isValidZipCode(String zipCode) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            ViaCepResponse response = restTemplate.getForObject(VIACEP_URL, ViaCepResponse.class, zipCode);

            return response != null && response.getError() == null;
        } catch (HttpClientErrorException e) {
            return false;
        }
    }
}
