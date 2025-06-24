package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.Client.ClientDTO;
import br.com.backend.backend.DTOs.Client.CreateClientDTO;
import br.com.backend.backend.ExternalServices.Notification.Email.BrevoEmailBuilder;
import br.com.backend.backend.ExternalServices.Notification.Email.Interfaces.EmailService;
import br.com.backend.backend.ExternalServices.Notification.Email.Models.BrevoEmailRequest;
import br.com.backend.backend.Services.Interfaces.ClientPasswordEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class ClientPasswordEmailServiceimpl implements ClientPasswordEmailService {

    private final EmailService<BrevoEmailRequest> emailService;
    private final BrevoEmailBuilder brevoEmailBuilder;
    
    @Override
    public CompletableFuture<Void> sendPasswordToClient(CreateClientDTO clientDTO, String randomPassword) {
        return CompletableFuture.supplyAsync(() -> {

            String htmlContent = buildPasswordEmailHtml(clientDTO.getName(), randomPassword);

            BrevoEmailRequest email = brevoEmailBuilder
                    .to(clientDTO.getEmail())
                    .withSubject("Sua senha de acesso ao sistema")
                    .withHtmlContent(htmlContent)
                    .build();

            return email;
        }).thenCompose(emailService::send);
    }

    private String buildPasswordEmailHtml(String clientName, String password) {
        return String.format("""
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Seu Acesso ao Sistema de Manutenção de Equipamentos</title>
                <style type="text/css">
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f8f9fa;
                    }
                    .container {
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        overflow: hidden;
                    }
                    .header {
                        background-color: #dc3545;
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                        font-weight: 600;
                    }
                    .content {
                        padding: 30px;
                    }
                    .password-section {
                        background-color: #f8f9fa;
                        border-left: 4px solid #007bff;
                        padding: 20px;
                        margin: 25px 0;
                        border-radius: 4px;
                    }
                    .password {
                        font-size: 24px;
                        font-weight: bold;
                        color: #007bff;
                        font-family: 'Courier New', monospace;
                        letter-spacing: 2px;
                        text-align: center;
                        margin: 10px 0;
                    }
                    .footer {
                        background-color: #f8f9fa;
                        padding: 20px 30px;
                        border-top: 1px solid #dee2e6;
                        font-size: 14px;
                        color: #6c757d;
                    }
                    .warning {
                        background-color: #fff3cd;
                        border: 1px solid #ffeaa7;
                        color: #856404;
                        padding: 15px;
                        border-radius: 4px;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1> Sistema de Manutenção de Equipamentos</h1>
                    </div>
                    <div class="content">
                        <p>Olá <strong>%s</strong>,</p>
                        <p>Bem-vindo ao nosso Sistema de Manutenção de Equipamentos! Sua conta foi criada com sucesso.</p>
            
                        <div class="password-section">
                            <p style="margin: 0 0 10px 0; font-weight: 600;">Sua senha temporária:</p>
                            <div class="password">%s</div>
                        </div>
            
                        <div class="warning">
                            <strong>⚠️ Importante:</strong> Por favor, altere esta senha imediatamente após seu primeiro login por questões de segurança.
                        </div>
            
                        <p>Para acessar sua conta, visite nosso portal e use seu endereço de email junto com a senha temporária fornecida acima.</p>
            
                        <p>Se você tiver alguma dúvida ou precisar de ajuda, não hesite em entrar em contato com nossa equipe de suporte.</p>
                    </div>
                    <div class="footer">
                        <p>Atenciosamente,<br>
                        <strong>Equipe Do Sistema de Manutenção</strong></p>
                        <p style="margin-top: 15px; font-size: 12px;">
                            Esta é uma mensagem automática. Por favor, não responda este email.
                        </p>
                    </div>
                </div>
            </body>
            </html>""",
                clientName,
                password
        );
    }
}