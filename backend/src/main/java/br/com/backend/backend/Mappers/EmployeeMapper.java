package br.com.backend.backend.Mappers;

import br.com.backend.backend.DTOs.Employee.EmployeeDTO;
import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Entities.Employee;
import br.com.backend.backend.Entities.EquipmentCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring", uses = { AccountMapper.class })
public interface EmployeeMapper {
    EmployeeDTO toDto(Employee employee);
    Employee toEntity(EmployeeDTO employeeDTO);
}
