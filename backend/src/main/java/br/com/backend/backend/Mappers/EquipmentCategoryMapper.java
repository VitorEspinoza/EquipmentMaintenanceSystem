package br.com.backend.backend.Mappers;

import br.com.backend.backend.DTOs.EquipmentCategoryInputDTO;
import br.com.backend.backend.DTOs.EquipmentCategoryResponseDTO;
import br.com.backend.backend.Entities.EquipmentCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


import java.util.List;

@Mapper(componentModel = "spring", uses = EquipmentMapper.class)
public interface EquipmentCategoryMapper {

    EquipmentCategoryResponseDTO toDto(EquipmentCategory category);

    List<EquipmentCategoryResponseDTO> toDtoList(List<EquipmentCategory> categories);

    EquipmentCategory toEntity(EquipmentCategoryInputDTO dto);
}