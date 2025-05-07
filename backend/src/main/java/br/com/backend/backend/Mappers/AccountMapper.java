package br.com.backend.backend.Mappers;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import br.com.backend.backend.Entities.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountDTO toDto(Account account);
}
