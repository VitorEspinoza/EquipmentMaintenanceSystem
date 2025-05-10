package br.com.backend.backend.Mappers;

import br.com.backend.backend.DTOs.Employee.EmployeeDTO;
import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Entities.Employee;
import br.com.backend.backend.Entities.EquipmentCategory;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    EmployeeDTO toDto(Employee employee);
}
