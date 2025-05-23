package br.com.backend.backend.ExternalServices.Notification.Email;

import org.springframework.beans.factory.annotation.Value;
import br.com.backend.backend.ExternalServices.Notification.Email.Models.BrevoAttachment;
import br.com.backend.backend.ExternalServices.Notification.Email.Models.BrevoContact;
import br.com.backend.backend.ExternalServices.Notification.Email.Models.BrevoEmailRequest;
import org.springframework.util.StringUtils;

import java.util.Base64;
import java.util.ArrayList;
import java.util.List;

public class BrevoEmailBuilder {
    private final String fromEmail;
    private final String fromName;

    private final List<BrevoContact> to = new ArrayList<>();
    private String subject;
    private String htmlContent;
    private final List<BrevoAttachment> attachments = new ArrayList<>();

    public BrevoEmailBuilder(
            @Value("${brevo.from.email}") String fromEmail,
            @Value("${brevo.from.name}") String fromName) {
        
        this.fromEmail = fromEmail;
        this.fromName = fromName;
    }

    public BrevoEmailBuilder to(String email) {
        return to(email, null);
    }

    public BrevoEmailBuilder to(String email, String name) {
        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("Recipient email cannot be empty");
        }
        this.to.add(new BrevoContact(email, name));
        return this;
    }

    public BrevoEmailBuilder withSubject(String subject) {
        if (!StringUtils.hasText(subject)) {
            throw new IllegalArgumentException("Subject cannot be empty");
        }
        this.subject = subject;
        return this;
    }

    public BrevoEmailBuilder withHtmlContent(String html) {
        this.htmlContent = html;
        return this;
    }

    public BrevoEmailBuilder attach(byte[] fileBytes, String fileName) {
        if (fileBytes == null || fileBytes.length == 0) {
            throw new IllegalArgumentException("File bytes cannot be empty");
        }
        if (fileName == null || fileName.trim().isEmpty()) {
            throw new IllegalArgumentException("File name cannot be empty");
        }

        String base64Content = Base64.getEncoder().encodeToString(fileBytes);
        this.attachments.add(new BrevoAttachment(base64Content, fileName));
        return this;
    }

    public BrevoEmailRequest build() {
        if (!StringUtils.hasText(subject)) {
            throw new IllegalStateException("Subject is required");
        }
        if (to.isEmpty()) {
            throw new IllegalStateException("At least one recipient is required");
        }

        return new BrevoEmailRequest(
                new BrevoContact(fromEmail, fromName),
                to,
                subject,
                htmlContent,
                attachments.isEmpty() ? null : attachments
        );
    }
}