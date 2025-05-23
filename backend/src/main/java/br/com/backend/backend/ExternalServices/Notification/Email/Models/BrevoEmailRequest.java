package br.com.backend.backend.ExternalServices.Notification.Email.Models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter 
@Setter
@AllArgsConstructor 
public class BrevoEmailRequest {
    private BrevoContact sender;
    private List<BrevoContact> to;
    private String subject;
    private String htmlContent;
    private List<BrevoAttachment> attachment;
}

