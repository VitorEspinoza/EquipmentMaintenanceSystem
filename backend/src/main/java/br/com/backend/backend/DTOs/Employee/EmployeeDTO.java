package br.com.backend.backend.DTOs.Employee;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import br.com.backend.backend.Entities.Employee;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EmployeeDTO {
    private Integer id;
    private Integer idAccount;
    private String name;
    private String email;
    private String role;
    private LocalDate birthDate;

    public static EmployeeDTO fromEntity(Employee employee) {
        return new EmployeeDTO(
                employee.getId(),
                employee.getAccount().getId(),
                employee.getName(),
                employee.getAccount().getEmail(),
                employee.getAccount().getRole(),
                employee.getBirthDate()
        );
    }
}
