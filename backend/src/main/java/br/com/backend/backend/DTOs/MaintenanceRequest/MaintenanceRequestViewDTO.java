package br.com.backend.backend.DTOs.MaintenanceRequest;

import br.com.backend.backend.DTOs.Client.ClientDTO;
import br.com.backend.backend.DTOs.Employee.EmployeeDTO;
import br.com.backend.backend.DTOs.EquipmentCategory.EquipmentCategoryResponseDTO;
import br.com.backend.backend.Entities.MaintenanceRequest;
import br.com.backend.backend.Entities.RequestStateHistory;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record MaintenanceRequestViewDTO(
        Integer id,
        String equipmentDescription,
        String defectDescription,
        LocalDateTime createdAt,
        String state,
        EquipmentCategoryResponseDTO equipmentCategory,
        ClientDTO client,

        BigDecimal quotedValue,
        LocalDateTime quotedAt,
        EmployeeDTO quotedByEmployee,

        LocalDateTime approvedAt,
        LocalDateTime rejectedAt,
        String rejectionReason,

        String maintenanceDescription,
        String customerGuidelines,
        LocalDateTime maintenanceCompletedAt,
        EmployeeDTO maintenanceEmployee,

        LocalDateTime paidAt,
        LocalDateTime finalizedAt,
        EmployeeDTO finalizedByEmployee,

        EmployeeDTO assignedToEmployee,

        List<RequestStateHistoryViewDTO> stateHistory

) {
    public static MaintenanceRequestViewDTO fromEntity(MaintenanceRequest entity) {
        return new MaintenanceRequestViewDTO(
                entity.getId(),

                entity.getDescription(),
                entity.getDefectDescription(),
                entity.getCreatedAt(),
                entity.getState().name(),
                EquipmentCategoryResponseDTO.fromEntity(entity.getCategory()),
                ClientDTO.fromEntity(entity.getClient()),
                
                entity.getQuotedValue(),
                entity.getQuotedAt(),
                entity.getQuotedByEmployee() != null ?
                        EmployeeDTO.fromEntity(entity.getQuotedByEmployee()) : null,

                entity.getApprovedAt(),
                entity.getRejectedAt(),
                entity.getRejectionReason(),

                entity.getMaintenanceDescription(),
                entity.getCustomerGuidelines(),
                entity.getMaintenanceCompletedAt(),
                entity.getMaintenanceEmployee() != null ?
                        EmployeeDTO.fromEntity(entity.getMaintenanceEmployee()) : null,

                entity.getPaidAt(),
                entity.getFinalizedAt(),
                entity.getFinalizedByEmployee() != null ?
                        EmployeeDTO.fromEntity(entity.getFinalizedByEmployee()) : null,

                entity.getAssignedToEmployee() != null ?
                        EmployeeDTO.fromEntity(entity.getAssignedToEmployee()) : null,

                entity.getStateHistory() != null ?
                entity.getStateHistory().stream()
                        .map(RequestStateHistoryViewDTO::fromEntity)
                        .toList() : null
        );
    }
}
