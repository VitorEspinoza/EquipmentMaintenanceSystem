package br.com.backend.backend.Security.auth;

import br.com.backend.backend.Entities.Account;
import br.com.backend.backend.Entities.Client;
import br.com.backend.backend.Entities.Employee;
import br.com.backend.backend.Repositories.ClientRepository;
import br.com.backend.backend.Repositories.EmployeeRepository;
import br.com.backend.backend.Services.ClientService;
import br.com.backend.backend.Services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static br.com.backend.backend.Security.SecurityConstants.*;

@Component
@RequiredArgsConstructor
public class AuthHelper {
    private final JwtUtils jwtUtils;
    private final EmployeeRepository employeeRepository;
    private final ClientRepository clientRepository;
    // private final RefreshTokenService refreshTokenService;

    public ResponseCookie generateAuthResponse(
            Account account
    ) {
        Integer id;
        Employee employee = getEmployeeFromAccountId(account.getId());

        if(employee == null) {
            Client client = getClientFromAccountId(account.getId());
            id = client.getId();
        } else {
            id = employee.getId();
        }

        List<String> roles = account.getAuthorities()
                .stream()
                .map(Object::toString)
                .toList();

        JwtPayload payload = new JwtPayload(
                account.getId().toString(),
                id.toString(),
                account.getEmail(),
                roles
        );

        String accessToken = jwtUtils.generateToken(payload);
        // String refreshToken = jwtUtils.generateRefreshToken(account);

        // refreshTokenService.saveRefreshToken(account.getUsername(), refreshToken);

        // ResponseCookie refreshCookie = buildCookie(REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_TOKEN_EXPIRATION_SECONDS);

        return buildCookie(ACCESS_TOKEN_COOKIE, accessToken, ACCESS_TOKEN_EXPIRATION_SECONDS);
    }

    private ResponseCookie buildCookie(String name, String value, int maxAgeSeconds) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAgeSeconds)
                .sameSite("Strict")
                .build();
    }

    private Employee getEmployeeFromAccountId(Integer id) {
        Optional<Employee> employee = employeeRepository.findEmployeeByAccount_Id(id);
        return employee.orElse(null);
    }

    private Client getClientFromAccountId(Integer id) {
        Optional<Client> client = clientRepository.findClientByAccount_Id(id);
        return client.orElse(null);
    }
}
