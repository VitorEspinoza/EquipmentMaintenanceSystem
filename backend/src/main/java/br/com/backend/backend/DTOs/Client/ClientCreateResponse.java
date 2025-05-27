package br.com.backend.backend.DTOs.Client;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseCookie;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ClientCreateResponse {
    private ClientDTO client;
    private ResponseCookie responseCookie;
}
