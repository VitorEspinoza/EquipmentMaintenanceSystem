package br.com.backend.backend.Exceptions.Custom;

public class AccountNotFoundException  extends ResourceNotFoundException{
    public AccountNotFoundException(String message) {
        super(message);
    }
}
