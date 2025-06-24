package br.com.backend.backend.DTOs.Client;

import br.com.backend.backend.DTOs.ResultViewModel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseCookie;

@AllArgsConstructor
@Getter
public class ClientCreateResult {
    private ResultViewModel<ClientDTO> response;
    private ResponseCookie responseCookie;
}
