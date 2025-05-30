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
    public ResultViewModel<MaintenanceRequestViewDTO> Create(MaintenanceRequestInputDTO maintenanceRequestInputDTO, Integer clientId);
    public ResultViewModel<List<MaintenanceRequestViewDTO>> GetAll(MaintenanceRequestFilter filter);
    public ResultViewModel<MaintenanceRequestViewDTO> GetById(Integer requestId, Integer clientId);
    public void Approve(Integer requestId, Integer clientId);
    public void Reject(Integer requestId, Integer clientId, RejectionInfo rejectionInfo);
    public void Pay(Integer requestId, Integer clientId);
}
