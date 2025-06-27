package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.Employee.CreateEmployeeDTO;
import br.com.backend.backend.DTOs.Employee.EmployeeDTO;
import br.com.backend.backend.DTOs.Employee.UpdateEmployeeDTO;
import br.com.backend.backend.DTOs.Page.PageDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Services.CurrentUserService;
import br.com.backend.backend.Services.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final CurrentUserService currentUserService;

    @PostMapping("/register")
    public ResponseEntity<ResultViewModel<EmployeeDTO>> create(@Valid @RequestBody CreateEmployeeDTO dto) {
        return ResponseEntity.ok().body(employeeService.create(dto));
    }

    @GetMapping("/{idEmployee}")
    public ResponseEntity<ResultViewModel<EmployeeDTO>> getById(@PathVariable Integer idEmployee) {
        return ResponseEntity.ok().body(employeeService.getById(idEmployee));
    }

    @GetMapping("/all")
    public ResponseEntity<ResultViewModel<List<EmployeeDTO>>> getAll(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "email", required = false) String email,
            @RequestParam(name = "active", required = false, defaultValue = "true") Boolean active,
            @RequestParam(name = "excludeSelf", required = false, defaultValue = "false") Boolean excludeSelf
            
    ) {
        var excludeEmployeeId = excludeSelf ? currentUserService.getUserEntityId() : null;
        var employees = employeeService.getAll(name, email, active, excludeEmployeeId);
        return ResponseEntity.ok().body(employees);
    }

    @PutMapping("/{idEmployee}")
    public ResponseEntity<ResultViewModel<EmployeeDTO>> update(@PathVariable Integer idEmployee, @RequestBody UpdateEmployeeDTO dto) {
        return ResponseEntity.ok().body(employeeService.update(idEmployee, dto));
    }

    @DeleteMapping("/{idEmployee}")
    public ResponseEntity<ResultViewModel<Void>> logicalDelete(@PathVariable Integer idEmployee) {
        if(currentUserService.getUserEntityId().equals(idEmployee)) {
            return ResponseEntity.badRequest().build();
        }
        employeeService.logicalDelete(idEmployee);
        return ResponseEntity.ok().build();
    }
}
