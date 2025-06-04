package br.com.backend.backend.Exceptions.Custom;

public class InvalidDeleteException extends RuntimeException {
    public InvalidDeleteException(String message) {
        super(message);
    }
}
