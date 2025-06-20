package br.com.backend.backend.Exceptions.Custom;

public class InactiveAccountException extends RuntimeException {
    public InactiveAccountException(String message) {
        super(message);
    }
}
