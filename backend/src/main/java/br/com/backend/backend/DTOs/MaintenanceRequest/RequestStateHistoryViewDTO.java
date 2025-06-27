package br.com.backend.backend.DTOs.MaintenanceRequest;

import br.com.backend.backend.Entities.RequestStateHistory;
import br.com.backend.backend.Enums.EnMaintenanceRequestState;

import java.time.LocalDateTime;

public record RequestStateHistoryViewDTO(
    Integer id,
    EnMaintenanceRequestState state,
    LocalDateTime changedAt,
    Integer changedByEmployeeId,
    String changedByEmployeeName
) {
    public static RequestStateHistoryViewDTO fromEntity(RequestStateHistory entity) {
        return new RequestStateHistoryViewDTO(
                entity.getId(),
                entity.getState(),
                entity.getChangedAt(),
                entity.getChangedByEmployee() != null ? entity.getChangedByEmployee().getId() : null,
                entity.getChangedByEmployee() != null ? entity.getChangedByEmployee().getName() : null
        );
    }

}