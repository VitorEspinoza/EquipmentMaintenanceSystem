package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import br.com.backend.backend.DTOs.Employee.CreateEmployeeDTO;
import br.com.backend.backend.DTOs.Employee.EmployeeDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Entities.Employee;
import br.com.backend.backend.Mappers.EmployeeMapper;
import br.com.backend.backend.Repositories.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AccountService accountService;
    private final EmployeeMapper employeeMapper;

    public ResultViewModel<EmployeeDTO> create(CreateEmployeeDTO createEmployeeDTO) {
        AccountDTO accountDTO = accountService.create(createEmployeeDTO.getAccount());
        log.info("Account created ID: {}", accountDTO.getId());
        Account account = accountService.getById(accountDTO.getId());

        Employee createEmploye = new Employee(account, createEmployeeDTO.getNome(), createEmployeeDTO.getBirthDate());
        Employee createdEmployee = employeeRepository.save(createEmploye);

        return ResultViewModel.success(employeeMapper.toDto(createdEmployee));
    }
}
