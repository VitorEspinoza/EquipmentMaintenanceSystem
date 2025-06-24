package br.com.backend.backend.Exceptions.Custom;

public class ClientNotFoundException extends ResourceNotFoundException {
        public ClientNotFoundException(Integer id) {
            super("Client not found with id: " + id);
        }
}
