package br.com.backend.backend.Mappers;

import br.com.backend.backend.DTOs.EquipmentDTO;
import br.com.backend.backend.Entities.Equipment;
import br.com.backend.backend.Entities.EquipmentCategory;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface EquipmentMapper {
    EquipmentMapper INSTANCE = Mappers.getMapper(EquipmentMapper.class);

    default String map(EquipmentCategory category) {
        return category != null ? category.getName() : null; // ou category.getDescription(), dependendo do seu caso
    }

    EquipmentDTO toDto(Equipment equipment);
}