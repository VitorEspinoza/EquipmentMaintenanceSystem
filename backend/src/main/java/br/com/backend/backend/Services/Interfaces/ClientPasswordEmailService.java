package br.com.backend.backend.Services.Interfaces;

import br.com.backend.backend.DTOs.Client.ClientDTO;
import br.com.backend.backend.DTOs.Client.CreateClientDTO;

import java.util.concurrent.CompletableFuture;

public interface ClientPasswordEmailService {

    CompletableFuture<Void> sendPasswordToClient(CreateClientDTO clientDTO, String randomPassword);
}
