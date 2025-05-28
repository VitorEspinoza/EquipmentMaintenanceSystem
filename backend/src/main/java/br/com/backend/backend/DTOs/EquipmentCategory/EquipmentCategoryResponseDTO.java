package br.com.backend.backend.DTOs.EquipmentCategory;

import br.com.backend.backend.Entities.EquipmentCategory;

public record EquipmentCategoryResponseDTO(
        Integer id,
        String name,
        String description,
        Boolean active
){
    public static EquipmentCategoryResponseDTO fromEntity(EquipmentCategory entity) {
        return new EquipmentCategoryResponseDTO(entity.getId(), entity.getName(), entity.getDescription(), entity.getActive());
    }
}