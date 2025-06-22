package br.com.backend.backend.DTOs.Employee;

import br.com.backend.backend.DTOs.Account.CreateAccountDTO;
import br.com.backend.backend.DTOs.Account.UpdateAccountDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateEmployeeDTO {
    private String email;
    private String name;
    private LocalDate birthDate;
}
