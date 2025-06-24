package br.com.backend.backend.Exceptions.Custom;

public class EmployeeNotResponsibleException extends RuntimeException{
    public EmployeeNotResponsibleException(String message) {
        super(message);
    }
}
