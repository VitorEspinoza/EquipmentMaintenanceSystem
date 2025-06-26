package br.com.backend.backend.Exceptions.Custom;

public class ReportDataNotFoundException extends ResourceNotFoundException {
    public ReportDataNotFoundException(String message) {
        super(message);
    }

}