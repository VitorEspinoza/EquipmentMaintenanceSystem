package br.com.backend.backend.Exceptions.Custom;

public class EquipmentCategoryNotFoundException extends ResourceNotFoundException {
    public EquipmentCategoryNotFoundException(Integer id) {
        super("Equipment category not found with id: " + id);
    }
}