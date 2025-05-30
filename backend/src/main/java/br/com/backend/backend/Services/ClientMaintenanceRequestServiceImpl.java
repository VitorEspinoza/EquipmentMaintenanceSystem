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
import br.com.backend.backend.Services.Interfaces.ClientMaintenanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientMaintenanceRequestServiceImpl implements ClientMaintenanceRequestService {

    private final ClientRepository clientRepository;
    private final EquipmentCategoryRepository equipmentCategoryRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;
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
    public ResultViewModel<List<MaintenanceRequestViewDTO>> GetAll(MaintenanceRequestFilter filter) {
        var spec = MaintenanceRequestSpecification.withFilter(filter);
        var requests = maintenanceRequestRepository.findAll(spec);

        var dtos = requests.stream()
                .map(MaintenanceRequestViewDTO::fromEntity)
                .toList();

        return ResultViewModel.success(dtos);
    }
    @Override
    public ResultViewModel<MaintenanceRequestViewDTO> GetById(Integer requestId, Integer clientId) {
        var request = getRequestById(requestId, clientId);
        return ResultViewModel.success(MaintenanceRequestViewDTO.fromEntity(request));
    }
    
    @Override
    public void Approve(Integer requestId, Integer clientId) {
        var request = getRequestById(requestId, clientId);
        request.Approve();
        maintenanceRequestRepository.save(request);
    }

    @Override
    public void Reject(Integer requestId, Integer clientId, RejectionInfo rejectionInfo) {
        var request = getRequestById(requestId, clientId);
        request.Reject(rejectionInfo.reason());
        maintenanceRequestRepository.save(request);
    }

    @Override
    public void Pay(Integer requestId, Integer clientId) {
        var request = getRequestById(requestId, clientId);
        request.Pay();
        maintenanceRequestRepository.save(request);
    }
    
    private MaintenanceRequest getRequestById(Integer requestId, Integer clientId) throws MaintenanceRequestNotFoundException {
        return maintenanceRequestRepository.findByIdAndClient_Id(requestId, clientId).orElseThrow(() -> new MaintenanceRequestNotFoundException(requestId)) ;
    }
}
