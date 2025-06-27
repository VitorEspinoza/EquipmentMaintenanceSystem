package br.com.backend.backend.Exceptions.Custom;

public class InvalidQuoteValueException extends RuntimeException {
    public InvalidQuoteValueException(String message) {
        super(message);
    }
}