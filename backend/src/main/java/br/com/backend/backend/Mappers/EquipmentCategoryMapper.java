package br.com.backend.backend.Mappers;

import br.com.backend.backend.DTOs.EquipmentCategoryResponseDTO;
import br.com.backend.backend.Entities.EquipmentCategory;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EquipmentCategoryMapper {
    EquipmentCategoryMapper INSTANCE = Mappers.getMapper(EquipmentCategoryMapper.class);

    EquipmentCategoryResponseDTO toDto(EquipmentCategory category);
    List<EquipmentCategoryResponseDTO> toDtoList(List<EquipmentCategory> categories);
}