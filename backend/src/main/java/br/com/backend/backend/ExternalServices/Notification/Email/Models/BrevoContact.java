package br.com.backend.backend.ExternalServices.Notification.Email.Models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BrevoContact {
    private String email;
    private String name;
}
