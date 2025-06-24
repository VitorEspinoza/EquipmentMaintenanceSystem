package br.com.backend.backend.DTOs.Account;

import br.com.backend.backend.Entities.Account;
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

    public static AccountDTO fromEntity(Account account) {
        return new AccountDTO(
                account.getId(),
                account.getEmail(),
                account.getRole()
        );
    }
}
