package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.Employee.CreateEmployeeDTO;
import br.com.backend.backend.DTOs.Employee.EmployeeDTO;
import br.com.backend.backend.DTOs.Employee.UpdateEmployeeDTO;
import br.com.backend.backend.DTOs.Page.PageDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping("/register")
    public ResponseEntity<ResultViewModel<EmployeeDTO>> create(@RequestBody CreateEmployeeDTO dto) {
        return ResponseEntity.ok().body(employeeService.create(dto));
    }

    @GetMapping("/{idEmployee}")
    public ResponseEntity<ResultViewModel<EmployeeDTO>> getById(@PathVariable Integer idEmployee) {
        return ResponseEntity.ok().body(employeeService.getById(idEmployee));
    }

    @GetMapping("/all")
    public ResponseEntity<ResultViewModel<PageDTO<EmployeeDTO>>> getAll(
            @RequestParam(name = "pageNumber", required = false, defaultValue = "0") Integer pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "30") Integer pageSize,
            @RequestParam(name = "orderBy", required = false) String orderBy,
            @RequestParam(name = "sort", required = false, defaultValue = "DESC") Sort.Direction sort,
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "email", required = false) String email,
            @RequestParam(name = "role", required = false, defaultValue = "EMPLOYEE") String role,
            @RequestParam(name = "active", required = false,defaultValue = "true") Boolean active
    ) {
        return ResponseEntity.ok().body(employeeService.getAll(pageNumber,pageSize, orderBy, sort, name, email, role, active));
    }

    @PutMapping("/{idEmployee}")
    public ResponseEntity<ResultViewModel<EmployeeDTO>> update(@PathVariable Integer idEmployee, @RequestBody UpdateEmployeeDTO dto) {
        return ResponseEntity.ok().body(employeeService.update(idEmployee, dto));
    }

    @DeleteMapping("/{idEmployee}")
    public ResponseEntity<ResultViewModel<Void>> logicalDelete(@PathVariable Integer idEmployee) {
        employeeService.logicalDelete(idEmployee);
        return ResponseEntity.ok().build();
    }
}
