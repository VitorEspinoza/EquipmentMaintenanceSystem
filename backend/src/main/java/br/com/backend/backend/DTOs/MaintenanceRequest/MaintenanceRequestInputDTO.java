package br.com.backend.backend.DTOs.MaintenanceRequest;

import br.com.backend.backend.Entities.Client;
import br.com.backend.backend.Entities.EquipmentCategory;
import br.com.backend.backend.Entities.MaintenanceRequest;
public record MaintenanceRequestInputDTO(
        String equipmentDescription,
        String defectDescription,
        Integer equipmentCategoryId
) {
    public MaintenanceRequest toEntity(Client client, EquipmentCategory equipmentCategory) {
        return new MaintenanceRequest(equipmentDescription, equipmentCategory, client, defectDescription);
    }
}