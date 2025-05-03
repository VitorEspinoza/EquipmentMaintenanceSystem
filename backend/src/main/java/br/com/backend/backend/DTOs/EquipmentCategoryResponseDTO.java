package br.com.backend.backend.DTOs;

import java.util.List;

public record EquipmentCategoryResponseDTO(
        Integer id,
        String name,
        String description,
        Boolean active,
        List<EquipmentDTO> equipments
){}