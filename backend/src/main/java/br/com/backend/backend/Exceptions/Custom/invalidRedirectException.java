package br.com.backend.backend.Exceptions.Custom;

public class invalidRedirectException extends RuntimeException {
    public invalidRedirectException(String message) {
        super(message);
    }
}
