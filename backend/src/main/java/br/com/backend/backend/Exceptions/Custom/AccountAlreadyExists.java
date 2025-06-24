package br.com.backend.backend.Exceptions.Custom;

public class AccountAlreadyExists extends RuntimeException {
    public AccountAlreadyExists(String fieldName) {
        super("Account with " + fieldName + " already exists.");
    }
}
