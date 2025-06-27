package br.com.backend.backend.Exceptions.Custom;

public class InvalidFilterException extends RuntimeException {
    public InvalidFilterException(String message) {
        super(message);
    }
}