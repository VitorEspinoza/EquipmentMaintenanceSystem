package br.com.backend.backend.ExternalServices.Notification.Email.Models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BrevoAttachment {
    private String content;
    private String name;
}
