package br.com.backend.backend.Services.Interfaces;

import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceInfo;
import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestInputDTO;
import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestViewDTO;
import br.com.backend.backend.DTOs.MaintenanceRequest.RejectionInfo;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Filters.MaintenanceRequestFilter;

import java.math.BigDecimal;
import java.util.List;

public interface ClientMaintenanceRequestService {
    public ResultViewModel<MaintenanceRequestViewDTO> create(MaintenanceRequestInputDTO maintenanceRequestInputDTO, Integer clientId);
    public ResultViewModel<List<MaintenanceRequestViewDTO>> getAll(MaintenanceRequestFilter filter);
    public ResultViewModel<MaintenanceRequestViewDTO> getById(Integer requestId, Integer clientId);
    public void approve(Integer requestId, Integer clientId);
    public void reject(Integer requestId, Integer clientId, RejectionInfo rejectionInfo);
    public void pay(Integer requestId, Integer clientId);
}
