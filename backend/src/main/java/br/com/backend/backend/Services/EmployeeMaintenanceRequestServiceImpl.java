package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceInfo;
import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestViewDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Entities.Employee;
import br.com.backend.backend.Entities.MaintenanceRequest;
import br.com.backend.backend.Exceptions.Custom.*;
import br.com.backend.backend.Repositories.ClientRepository;
import br.com.backend.backend.Repositories.EmployeeRepository;
import br.com.backend.backend.Repositories.EquipmentCategoryRepository;
import br.com.backend.backend.Repositories.MaintenanceRequestRepository;
import br.com.backend.backend.Filters.MaintenanceRequestFilter;
import br.com.backend.backend.Filters.MaintenanceRequestSpecification;
import br.com.backend.backend.Services.Interfaces.EmployeeMaintenanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class EmployeeMaintenanceRequestServiceImpl implements EmployeeMaintenanceRequestService {
    
    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final CurrentUserService currentUserService;

    @Override
    public ResultViewModel<MaintenanceRequestViewDTO> getById(Integer id) {
        var request = getRequestById(id);
        return ResultViewModel.success(MaintenanceRequestViewDTO.fromEntity(request));
    }

    @Override
    public ResultViewModel<List<MaintenanceRequestViewDTO>> getAll(MaintenanceRequestFilter filter) {
        var spec = MaintenanceRequestSpecification.withFilter(filter);
        var requests = maintenanceRequestRepository.findAll(spec);

        var dtos = requests.stream()
                .map(MaintenanceRequestViewDTO::fromEntity)
                .toList();

        return ResultViewModel.success(dtos);
    }
    @Override
    public void quote(Integer id, BigDecimal value, Integer employeeId) {
        var request = getRequestById(id);
        
        var employee = getEmployeeById(employeeId);

        if(!request.getAssignedToEmployee().getId().equals(employeeId)) {
            throw new EmployeeNotResponsibleException("Employee not responsible for this request");
        }

        request.Quote(value, employee);
        
        maintenanceRequestRepository.save(request);
    }
    @Override
    public void redirectEmployee(Integer id, Integer newEmployeeId) {
        var request = getRequestById(id);
        
        if(Objects.equals(request.getAssignedToEmployee().getId(), newEmployeeId)) {
            throw new invalidRedirectException("Employee is already assigned to this request");
        }

        Integer loggedEmployeeId = currentUserService.getUserEntityId();

        if(!request.getAssignedToEmployee().getId().equals(loggedEmployeeId)) {
            throw new EmployeeNotResponsibleException("Employee not responsible for this request");
        }

        if(loggedEmployeeId.equals(newEmployeeId)) {
            throw new invalidRedirectException("Employees cannot redirect to themselves.");
        }

        var newEmployee = getEmployeeById(newEmployeeId);
        
        request.RedirectEmployee(newEmployee);
        
        maintenanceRequestRepository.save(request);
    }

    @Override
    public void doMaintenance(Integer id, Integer employeeId, MaintenanceInfo maintenanceInfo) {
        var request = getRequestById(id);
        var employee = getEmployeeById(employeeId);

        if(!request.getAssignedToEmployee().getId().equals(employeeId)) {
            throw new EmployeeNotResponsibleException("Employee not responsible for this request");
        }

        request.DoMaintenance(employee, maintenanceInfo.maintenanceDescription(), maintenanceInfo.customerGuidelines());
        
        maintenanceRequestRepository.save(request);
    }

    @Override
    public void finalizeMaintenance(Integer id, Integer employeeId) {
        var request = getRequestById(id);
        var employee = getEmployeeById(employeeId);

        if(!request.getAssignedToEmployee().getId().equals(employeeId)) {
            throw new EmployeeNotResponsibleException("Employee not responsible for this request");
        }

        request.Finalize(employee);
        
        maintenanceRequestRepository.save(request);
    }
    
    private MaintenanceRequest getRequestById(Integer id) {
        return maintenanceRequestRepository.findById(id).orElseThrow(() -> new MaintenanceRequestNotFoundException(id));
    }

    private Employee getEmployeeById(Integer id) {
        return employeeRepository.findById(id).orElseThrow(() -> new EmployeeNotFoundException(id));
    }
}
