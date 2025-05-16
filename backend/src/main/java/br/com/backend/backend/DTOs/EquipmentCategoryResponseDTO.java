package br.com.backend.backend.DTOs;

import java.util.List;
import java.util.Set;

public record EquipmentCategoryResponseDTO(
        Integer id,
        String name,
        String description,
        Boolean active,
        Set<EquipmentDTO> equipments
){}