package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import br.com.backend.backend.DTOs.Account.CreateAccountDTO;
import br.com.backend.backend.DTOs.Employee.CreateEmployeeDTO;
import br.com.backend.backend.DTOs.Employee.EmployeeDTO;
import br.com.backend.backend.DTOs.Employee.UpdateEmployeeDTO;
import br.com.backend.backend.DTOs.Page.PageDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Entities.Employee;
import br.com.backend.backend.Exceptions.Custom.AccountAlreadyExists;
import br.com.backend.backend.Exceptions.Custom.EmployeeNotFoundException;
import br.com.backend.backend.Exceptions.Custom.InvalidDeleteException;
import br.com.backend.backend.Filters.EmployeeSpecifications;
import br.com.backend.backend.Repositories.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AccountService accountService;
    private final CurrentUserService currentUserService;

    public ResultViewModel<EmployeeDTO> create(CreateEmployeeDTO createEmployeeDTO) {
        CreateAccountDTO accountCreate = new CreateAccountDTO(createEmployeeDTO.getEmail(), createEmployeeDTO.getPassword(), "EMPLOYEE");
        AccountDTO accountDTO = accountService.create(accountCreate);
        log.info("Account created ID: {}", accountDTO.getId());
        Account account = accountService.getById(accountDTO.getId());

        Employee createEmploye = new Employee(account, createEmployeeDTO.getName(), createEmployeeDTO.getBirthDate());
        Employee createdEmployee = employeeRepository.save(createEmploye);

        return ResultViewModel.success(EmployeeDTO.fromEntity(createdEmployee));
    }

    public ResultViewModel<EmployeeDTO> getById(Integer idEmployee) {
        Employee employee = findById(idEmployee);
        return ResultViewModel.success(EmployeeDTO.fromEntity(employee));
    }

    public Employee findById(Integer idEmployee) {
        return employeeRepository.findById(idEmployee).
                orElseThrow(() ->
                        new EmployeeNotFoundException(idEmployee)
                );
    }

    public ResultViewModel<EmployeeDTO> update(Integer idEmployee, UpdateEmployeeDTO dto) {
        Employee employee = findById(idEmployee);

        if(accountService.emailAccountAlreadyInUse(dto.getEmail(), employee.getAccount().getId())) {
            throw new AccountAlreadyExists("email");
        }

        employee.update(dto.getName(), dto.getEmail(), dto.getRole(), dto.getBirthDate());
        employeeRepository.save(employee);
        return ResultViewModel.success(EmployeeDTO.fromEntity(employee));
    }

    public void logicalDelete(Integer idEmployee) {
        Employee employee = findById(idEmployee);
        Account loggedEmployeeId = currentUserService.getCurrentUser();

        if(loggedEmployeeId.getId().equals(employee.getId())) {
            throw new InvalidDeleteException("Employees cannot delete themselves.");
        }

        employee.inactivate();
        employeeRepository.save(employee);
    }


    public ResultViewModel<List<EmployeeDTO>> getAll(
            String name,
            String email,
            Boolean active,
            Integer excludeEmployeeId
    ) {


        Specification<Employee> spec = Specification.where(EmployeeSpecifications.nameContains(name))
                .and(EmployeeSpecifications.emailContains(email))
                .and(EmployeeSpecifications.isActive(active))
                .and(EmployeeSpecifications.excludeEmployeeId(excludeEmployeeId));

        List<Employee> employees = employeeRepository.findAll(spec);

        List<EmployeeDTO> employeesDTOs = employees.stream()
                .map(EmployeeDTO::fromEntity)
                .toList();


        return new ResultViewModel<List<EmployeeDTO>>(employeesDTOs);
    }
}
