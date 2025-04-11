package br.com.backend.backend.DTOs;


import br.com.backend.backend.Entities.EquipmentCategory;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Equipment category with list of associated equipment")
public record EquipmentCategoryResponseDTO(
        Integer id,
        String name,
        String description,
        Boolean active,
        List<EquipmentDTO> equipments
) {
    public static EquipmentCategoryResponseDTO fromEntity(EquipmentCategory category) {
        return new EquipmentCategoryResponseDTO(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getActive(),
                category.getEquipments().stream()
                        .map(equipment -> new EquipmentDTO(
                                equipment.getId(),
                                equipment.getDescription(),
                                equipment.getCategory() != null ? equipment.getCategory().getName() : null
                        ))
                        .toList()
        );
    }
}
