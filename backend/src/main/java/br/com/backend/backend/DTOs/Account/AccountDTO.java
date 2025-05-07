package br.com.backend.backend.DTOs.Account;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AccountDTO {
    private Integer id;
    private String email;
    private String role;
}
