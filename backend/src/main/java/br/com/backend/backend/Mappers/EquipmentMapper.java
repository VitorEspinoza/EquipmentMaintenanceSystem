package br.com.backend.backend.Mappers;

import br.com.backend.backend.DTOs.EquipmentDTO;
import br.com.backend.backend.Entities.Equipment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EquipmentMapper {
    EquipmentDTO toDto(Equipment equipment);
}