package br.com.backend.backend.Exceptions.Custom;

import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
public class ClientCreationInvalidException extends RuntimeException {
    private List<String> errors;
    public ClientCreationInvalidException(List<String> validations) {
        this.errors = validations;
    }
}
