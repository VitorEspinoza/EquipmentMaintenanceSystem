package br.com.backend.backend.DTOs.EquipmentCategory;

import br.com.backend.backend.DTOs.Equipment.EquipmentDTO;
import br.com.backend.backend.Entities.EquipmentCategory;

import java.util.Set;
import java.util.stream.Collectors;

public record EquipmentCategoryResponseDTO(
        Integer id,
        String name,
        String description,
        Boolean active,
        Set<EquipmentDTO> equipments
){
    public static EquipmentCategoryResponseDTO fromEntity(EquipmentCategory entity) {
        return new EquipmentCategoryResponseDTO(entity.getId(), entity.getName(), entity.getDescription(), entity.getActive(),  entity.getEquipments().stream()
                .map(EquipmentDTO::fromEntity)
                .collect(Collectors.toSet()));
    }
}