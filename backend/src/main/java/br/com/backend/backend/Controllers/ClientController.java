package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.Account.AccountDTO;
import br.com.backend.backend.DTOs.Auth.AuthRequestDTO;
import br.com.backend.backend.DTOs.Auth.AuthResponseDTO;
import br.com.backend.backend.DTOs.Client.ClientDTO;
import br.com.backend.backend.DTOs.Client.CreateClientDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Services.AuthService;
import br.com.backend.backend.Services.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<ResultViewModel<AccountDTO>> create(@Valid @RequestBody CreateClientDTO dto) {
        var response = clientService.create(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, response.getCookie().toString())
                .body(ResultViewModel.success(response.getAccount()));
    }
//    @PostMapping("/login")
//    public ResponseEntity<ResultViewModel<AccountDTO>> login(@RequestBody AuthRequestDTO dto) {
//       
//        return ResponseEntity.ok()
//                .header(HttpHeaders.SET_COOKIE, response.getCookie().toString())
//                .body(ResultViewModel.success(response.getAccount()));
//    }
}
