package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceInfo;
import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestInputDTO;
import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestViewDTO;
import br.com.backend.backend.DTOs.MaintenanceRequest.RejectionInfo;
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
import br.com.backend.backend.Services.Interfaces.MaintenanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceRequestServiceImpl implements MaintenanceRequestService {

    private final ClientRepository clientRepository;
    private final EquipmentCategoryRepository equipmentCategoryRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final EmployeeRepository employeeRepository;
    @Override
    public ResultViewModel<MaintenanceRequestViewDTO> Create(MaintenanceRequestInputDTO maintenanceRequestInputDTO, Integer clientId) {
        var client = clientRepository.findById(clientId).orElseThrow(() -> new ClientNotFoundException(clientId));
        
        var equipmentCategoryId = maintenanceRequestInputDTO.equipmentCategoryId();
        var equipmentCategory = equipmentCategoryRepository.findById(equipmentCategoryId).orElseThrow(() -> new EquipmentCategoryNotFoundException(equipmentCategoryId));
        
        var maintenanceRequest = maintenanceRequestInputDTO.toEntity(client, equipmentCategory);
        
        var savedRequest = maintenanceRequestRepository.save(maintenanceRequest);

        return ResultViewModel.success(MaintenanceRequestViewDTO.fromEntity(savedRequest));
    }

    @Override
    public ResultViewModel<MaintenanceRequestViewDTO> GetById(Integer id) {
        var request = getRequestById(id);
        return ResultViewModel.success(MaintenanceRequestViewDTO.fromEntity(request));
    }

    @Override
    public ResultViewModel<List<MaintenanceRequestViewDTO>> GetAll(MaintenanceRequestFilter filter) {
        var spec = MaintenanceRequestSpecification.withFilter(filter);
        var requests = maintenanceRequestRepository.findAll(spec);

        var dtos = requests.stream()
                .map(MaintenanceRequestViewDTO::fromEntity)
                .toList();

        return ResultViewModel.success(dtos);
    }
    @Override
    public void Quote(Integer id, BigDecimal value, Integer employeeId) {
        var request = getRequestById(id);
        
        var employee = getEmployeeById(employeeId);
        
        request.Quote(value, employee);
        
        maintenanceRequestRepository.save(request);
    }

    @Override
    public void Approve(Integer id) {
        var request = getRequestById(id);
        request.Approve();
        maintenanceRequestRepository.save(request);
    }

    @Override
    public void Reject(Integer id, RejectionInfo rejectionInfo) {
        var request = getRequestById(id);
        request.Reject(rejectionInfo.reason());
        maintenanceRequestRepository.save(request);
    }

    @Override
    public void Pay(Integer id) {
        var request = getRequestById(id);
        request.Pay();
        maintenanceRequestRepository.save(request);
    }

    @Override
    public void RedirectEmployee(Integer id, Integer newEmployeeId) {
        var request = getRequestById(id);
        
        if(request.getAssignedToEmployee().getId() == newEmployeeId) {
            throw new invalidRedirectException("Employee is already assigned to this request");
        }
        var newEmployee = getEmployeeById(newEmployeeId);
        
        request.RedirectEmployee(newEmployee);
        
        maintenanceRequestRepository.save(request);
    }

    @Override
    public void DoMaintenance(Integer id, Integer employeeId, MaintenanceInfo maintenanceInfo) {
        var request = getRequestById(id);
        var employee = getEmployeeById(employeeId);
        
        request.DoMaintenance(employee, maintenanceInfo.maintenanceDescription(), maintenanceInfo.customerGuidelines());
        
        maintenanceRequestRepository.save(request);
    }

    @Override
    public void FinalizeMaintenance(Integer id, Integer employeeId) {
        var request = getRequestById(id);
        var employee = getEmployeeById(employeeId);
        
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
