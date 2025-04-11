package br.com.backend.backend.DTOs;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Equipment with category data")
public record EquipmentCategoryInputDTO(String name, String description) {}