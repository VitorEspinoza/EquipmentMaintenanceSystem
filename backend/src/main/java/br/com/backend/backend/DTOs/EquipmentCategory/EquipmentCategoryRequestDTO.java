package br.com.backend.backend.DTOs.EquipmentCategory;

import br.com.backend.backend.Entities.EquipmentCategory;

public record EquipmentCategoryRequestDTO(String name, String description) {
    public EquipmentCategory toEntity() {
        return new EquipmentCategory(name, description);
    }
}

