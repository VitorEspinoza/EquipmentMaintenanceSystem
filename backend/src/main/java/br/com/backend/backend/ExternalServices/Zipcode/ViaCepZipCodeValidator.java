package br.com.backend.backend.ExternalServices.Zipcode;

import br.com.backend.backend.ExternalServices.Zipcode.models.ViaCepResponse;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

public class ViaCepZipCodeValidator implements ZipCodeValidator {
    private static final String VIACEP_URL = "https://viacep.com.br/ws/{cep}/json/";

    @Override
    public boolean isValidZipCode(String zipCode) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            ViaCepResponse response = restTemplate.getForObject(VIACEP_URL, ViaCepResponse.class, zipCode);

            return Objects.nonNull(response) && Objects.isNull(response.getErro());
        } catch (HttpClientErrorException e) {
            return false;
        }
    }
}
