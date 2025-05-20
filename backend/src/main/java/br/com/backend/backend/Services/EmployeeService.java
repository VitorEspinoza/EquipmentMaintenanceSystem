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
import br.com.backend.backend.Filters.EmployeeSpecifications;
import br.com.backend.backend.Repositories.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    public ResultViewModel<EmployeeDTO> create(CreateEmployeeDTO createEmployeeDTO) {
        CreateAccountDTO accountCreate = new CreateAccountDTO(createEmployeeDTO.getEmail(), createEmployeeDTO.getPassword(), "EMPLOYEE");
        AccountDTO accountDTO = accountService.create(accountCreate);
        log.info("Account created ID: {}", accountDTO.getId());
        Account account = accountService.getById(accountDTO.getId());

        Employee createEmploye = new Employee(account, createEmployeeDTO.getNome(), createEmployeeDTO.getBirthDate());
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

        if(accountService.emailAccountAlreadyInUse(dto.getEmail())) {
            throw new AccountAlreadyExists("email");
        }

        employee.update(dto.getNome(), dto.getEmail(), dto.getRole(), dto.getBirthDate());
        employeeRepository.save(employee);
        return ResultViewModel.success(EmployeeDTO.fromEntity(employee));
    }

    public void logicalDelete(Integer idEmployee) {
        Employee employee = findById(idEmployee);

        employee.inactivate();
        employeeRepository.save(employee);
    }


    public ResultViewModel<PageDTO<EmployeeDTO>> getAll(
            Integer pageNumber,
            Integer pageSize,
            String orderBy,
            Sort.Direction sort,
            String name,
            String email,
            String role,
            Boolean active
    ) {
        Sort sortObj = (orderBy != null) ? Sort.by(sort, orderBy) : Sort.unsorted();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sortObj);

        Specification<Employee> spec = Specification.where(EmployeeSpecifications.nameContains(name))
                .and(EmployeeSpecifications.emailContains(email))
                .and(EmployeeSpecifications.hasRole(role))
                .and(EmployeeSpecifications.isActive(active));

        Page<Employee> page = employeeRepository.findAll(spec, pageable);

        // Mapeamento para DTO
        List<EmployeeDTO> content = page.getContent().stream()
                .map(EmployeeDTO::fromEntity)
                .toList();

        PageDTO<EmployeeDTO> pageDTO = new PageDTO<>();
        pageDTO.setTotalElements(page.getTotalElements());
        pageDTO.setTotalPages(page.getTotalPages());
        pageDTO.setPage(page.getNumber());
        pageDTO.setSize(page.getSize());
        pageDTO.setContent(content);

        return new ResultViewModel<>(pageDTO);
    }
}
