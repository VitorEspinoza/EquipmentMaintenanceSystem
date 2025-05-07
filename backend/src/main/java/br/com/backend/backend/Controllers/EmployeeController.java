package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.Employee.CreateEmployeeDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping("/register")
    public ResponseEntity<ResultViewModel<EmployeeDTO>> create(@RequestBody CreateEmployeeDTO dto) {
        return ResponseEntity.created(employeeService.create(dto));
    }
}
