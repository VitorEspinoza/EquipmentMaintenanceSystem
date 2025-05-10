package br.com.backend.backend.Security.auth;

public record JwtPayload(String id, String email, String role) {}
