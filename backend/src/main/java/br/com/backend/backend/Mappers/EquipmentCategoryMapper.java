package br.com.backend.backend.Mappers;

import br.com.backend.backend.DTOs.EquipmentCategoryRequestDTO;
import br.com.backend.backend.DTOs.EquipmentCategoryResponseDTO;
import br.com.backend.backend.DTOs.EquipmentDTO;
import br.com.backend.backend.Entities.Equipment;
import br.com.backend.backend.Entities.EquipmentCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EquipmentCategoryMapper {
    EquipmentCategoryMapper INSTANCE = Mappers.getMapper(EquipmentCategoryMapper.class);

    @Mapping(target = "equipments", source = "equipments")
    EquipmentCategoryResponseDTO entityToDto(EquipmentCategory equipmentCategory);

    @Mapping(target = "category", source = "category.name")
    EquipmentDTO equipmentToDto(Equipment equipment);

    default EquipmentCategory requestDtoToEntity(EquipmentCategoryRequestDTO requestDTO) {
        return new EquipmentCategory(requestDTO.name(), requestDTO.description());
    }

    default List<EquipmentCategoryResponseDTO> entitiesToDtos(List<EquipmentCategory> categoriesList) {
        return categoriesList.stream()
                .map(this::entityToDto)
                .toList();
    }
}