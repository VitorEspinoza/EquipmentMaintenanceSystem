package br.com.backend.backend.DTOs;

import br.com.backend.backend.Entities.Equipment;

public record EquipmentDTO(Integer id, String description, String category) {

    public static EquipmentDTO fromEntity(Equipment e) {
        return new EquipmentDTO(e.getId(), e.getDescription(), e.getCategory() != null ? e.getCategory().getName() : null);
    }
}