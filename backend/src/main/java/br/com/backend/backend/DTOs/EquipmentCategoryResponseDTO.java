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
){}