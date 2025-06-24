package br.com.backend.backend.ExternalServices.Notification.Email;

import br.com.backend.backend.ExternalServices.Notification.Email.Interfaces.EmailService;
import br.com.backend.backend.ExternalServices.Notification.Email.Models.BrevoEmailRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;

@Service
public class BrevoEmailService implements EmailService<BrevoEmailRequest> {

    private final RestTemplate restTemplate;
    private final String brevoApiUrl;
    private final String brevoApiKey;
    private final ObjectMapper objectMapper;

    public BrevoEmailService(RestTemplate restTemplate, @Value("${brevo.api.url}") String brevoApiUrl,
                             @Value("${brevo.api.key}") String brevoApiKey) {
        this.restTemplate = restTemplate;
        this.brevoApiUrl = brevoApiUrl;
        this.brevoApiKey = brevoApiKey;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.LOWER_CAMEL_CASE);
    }

    @Override
    public CompletableFuture<Void> send(BrevoEmailRequest request) {
        return CompletableFuture.runAsync(() -> {
      
                String requestBody;
                try {
                    requestBody = objectMapper.writeValueAsString(request);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException("Failed to serialize email request", e);
                }

                HttpHeaders headers = createHeaders();
                HttpEntity<String> httpEntity = new HttpEntity<>(requestBody, headers);

                ResponseEntity<String> response = restTemplate.exchange(
                        brevoApiUrl + "/smtp/email",
                        HttpMethod.POST,
                        httpEntity,
                        String.class
                );

                
                if (!response.getStatusCode().is2xxSuccessful()) {
                    throw new RuntimeException("Failed to send email. Status code: " + response.getStatusCode());
                }
                });
        
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        headers.set("api-key", brevoApiKey);
        headers.set("accept", "application/json");
        return headers;
    }
}