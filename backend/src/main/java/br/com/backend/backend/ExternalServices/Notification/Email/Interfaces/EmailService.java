package br.com.backend.backend.ExternalServices.Notification.Email.Interfaces;

import java.util.concurrent.CompletableFuture;

public interface EmailService<TEmailFormat> {
    CompletableFuture<Void> send(TEmailFormat request);
}