package br.com.backend.backend.Security.auth;

import java.util.List;

public record JwtPayload(String id, String idEntity, String email, List<String> roles) {}
