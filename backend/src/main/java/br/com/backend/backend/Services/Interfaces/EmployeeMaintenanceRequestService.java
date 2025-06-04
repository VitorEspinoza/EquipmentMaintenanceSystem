package br.com.backend.backend.Services.Interfaces;

import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceInfo;
import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestInputDTO;
import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestViewDTO;
import br.com.backend.backend.DTOs.MaintenanceRequest.RejectionInfo;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Filters.MaintenanceRequestFilter;

import java.math.BigDecimal;
import java.util.List;

public interface EmployeeMaintenanceRequestService {
    public ResultViewModel<List<MaintenanceRequestViewDTO>> getAll(MaintenanceRequestFilter filter);
    public ResultViewModel<MaintenanceRequestViewDTO> getById(Integer id);
    public void quote(Integer id, BigDecimal value, Integer employeeId);
    public void redirectEmployee(Integer id, Integer newEmployeeId);
    public void doMaintenance(Integer id, Integer employeeId, MaintenanceInfo maintenanceInfo);
    public void finalizeMaintenance(Integer id, Integer employeeId);
}
