package br.com.backend.backend.Exceptions.Custom;

public class MaintenanceRequestNotFoundException extends ResourceNotFoundException {
    public MaintenanceRequestNotFoundException(Integer id) {
        super("Maintenance request not found with id: " + id);
    }
}
