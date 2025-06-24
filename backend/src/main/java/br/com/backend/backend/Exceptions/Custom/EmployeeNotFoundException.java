package br.com.backend.backend.Exceptions.Custom;

public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Integer id) {
        super("Employee with id " + id + " not found");
    }
}
