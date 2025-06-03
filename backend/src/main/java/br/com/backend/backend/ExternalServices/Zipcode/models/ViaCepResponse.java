package br.com.backend.backend.ExternalServices.Zipcode.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ViaCepResponse {
    private String zipcode;
    private Boolean error;
}

