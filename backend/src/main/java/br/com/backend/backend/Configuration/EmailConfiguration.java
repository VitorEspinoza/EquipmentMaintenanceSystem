package br.com.backend.backend.Configuration;

import br.com.backend.backend.ExternalServices.Notification.Email.BrevoEmailBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class EmailConfiguration {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public BrevoEmailBuilder brevoEmailBuilder(
            @Value("${brevo.from.email}") String fromEmail,
            @Value("${brevo.from.name}") String fromName) {
        return new BrevoEmailBuilder(fromEmail, fromName);
    }
}