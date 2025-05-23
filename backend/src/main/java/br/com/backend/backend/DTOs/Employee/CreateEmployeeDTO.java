package br.com.backend.backend.DTOs.Employee;

import br.com.backend.backend.DTOs.Account.CreateAccountDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateEmployeeDTO {
    private String email;
    private String password;
    private String name;
    private LocalDate birthDate;
}
