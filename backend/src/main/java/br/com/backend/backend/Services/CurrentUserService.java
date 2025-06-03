package br.com.backend.backend.Services;

import br.com.backend.backend.Entities.Account;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    public Integer getUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof Account account) {
            return account.getId();
        }

        throw new IllegalStateException("Usuário não autenticado ou tipo inesperado de principal");
    }

    public Integer getUserEntityId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof Account account) {
            return account.getEntityId();
        }

        throw new IllegalStateException("Usuário não autenticado ou tipo inesperado de principal");
    }

    public Account getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof Account account) {
            return account;
        }

        throw new IllegalStateException("Usuário não autenticado ou tipo inesperado de principal");
    }
}

