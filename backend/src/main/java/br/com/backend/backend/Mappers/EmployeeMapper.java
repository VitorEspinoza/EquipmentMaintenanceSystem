package br.com.backend.backend.Mappers;

import br.com.backend.backend.DTOs.Employee.EmployeeDTO;
import br.com.backend.backend.Entities.Employee;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    EmployeeDTO toDto(Employee employee);
}
