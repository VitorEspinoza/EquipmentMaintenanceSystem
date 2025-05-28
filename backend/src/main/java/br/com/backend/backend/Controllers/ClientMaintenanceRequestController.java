package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestInputDTO;
import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestViewDTO;
import br.com.backend.backend.DTOs.MaintenanceRequest.RejectionInfo;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Enums.EnMaintenanceRequestState;
import br.com.backend.backend.Enums.EnDateFilter;
import br.com.backend.backend.Filters.MaintenanceRequestFilter;
import br.com.backend.backend.Services.Interfaces.ClientMaintenanceRequestService;
import br.com.backend.backend.Services.Interfaces.EmployeeMaintenanceRequestService;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/client/maintenance-request")
public class ClientMaintenanceRequestController {

    private final ClientMaintenanceRequestService service;
    
    @GetMapping
    public ResponseEntity<ResultViewModel<List<MaintenanceRequestViewDTO>>> getAllRequests(
            @RequestParam(required = false) EnDateFilter dateFilter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) EnMaintenanceRequestState state,
            @RequestParam Integer clientId
    ) {
        MaintenanceRequestFilter filter = MaintenanceRequestFilter.builder()
                .dateFilter(dateFilter != null ? dateFilter : EnDateFilter.ALL)
                .from(from)
                .to(to)
                .state(state)
                .clientId(clientId)
                .build();

        filter.validate();

        var requests = service.GetAll(filter);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultViewModel<MaintenanceRequestViewDTO>> GetById(@PathVariable Integer id,  @RequestParam Integer clientId) {
        var request = service.GetById(id, clientId);

        return ResponseEntity.status(HttpStatus.OK).body(request);
    }

    @PostMapping
    public ResponseEntity<ResultViewModel<MaintenanceRequestViewDTO>> Create(@RequestBody MaintenanceRequestInputDTO dto, @RequestParam Integer clientId) {
        var created = service.Create(dto, clientId);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("{id}/approve")
    public ResponseEntity<Void> ApproveMaintenance(@PathVariable Integer id,  @RequestParam Integer clientId) {
        service.Approve(id, clientId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("{id}/reject")
    public ResponseEntity<Void> RejectMaintenance(@PathVariable Integer id,  @RequestParam Integer clientId, RejectionInfo rejectionInfo) {
        service.Reject(id, clientId, rejectionInfo);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("{id}/pay")
    public ResponseEntity<Void> PayMaintenance(@PathVariable Integer id,  @RequestParam Integer clientId) {
        service.Pay(id, clientId);

        return ResponseEntity.noContent().build();
    }
}
