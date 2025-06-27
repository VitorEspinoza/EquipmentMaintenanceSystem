package br.com.backend.backend.Exceptions.Custom;

public class InvalidZipCodeException extends RuntimeException {
    public InvalidZipCodeException(String message) {
        super(message);
    }
}
