package br.com.backend.backend.DTOs.Equipment;

import br.com.backend.backend.Entities.Equipment;

public record EquipmentDTO(Integer id, String description, String category) {

    public static EquipmentDTO fromEntity(Equipment entity) {
        return new EquipmentDTO(entity.getId(), entity.getDescription(), entity.getCategory().getName());
    }
}