package br.com.backend.backend.DTOs.Account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateAccountDTO {
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String role;
}
