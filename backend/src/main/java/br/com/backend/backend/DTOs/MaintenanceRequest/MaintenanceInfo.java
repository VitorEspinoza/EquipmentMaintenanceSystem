package br.com.backend.backend.DTOs.MaintenanceRequest;

import lombok.Getter;
public record MaintenanceInfo(
        String maintenanceDescription,
        String customerGuidelines
) {}