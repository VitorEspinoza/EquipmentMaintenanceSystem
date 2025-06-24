package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestInputDTO;
import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestViewDTO;
import br.com.backend.backend.DTOs.MaintenanceRequest.RejectionInfo;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Enums.EnMaintenanceRequestState;
import br.com.backend.backend.Enums.EnDateFilter;
import br.com.backend.backend.Filters.MaintenanceRequestFilter;
import br.com.backend.backend.Services.CurrentUserService;
import br.com.backend.backend.Services.Interfaces.ClientMaintenanceRequestService;
import br.com.backend.backend.Services.Interfaces.EmployeeMaintenanceRequestService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/client/maintenance-request")
public class ClientMaintenanceRequestController {

    private final ClientMaintenanceRequestService service;
    private final CurrentUserService currentUserService;

    @GetMapping
    public ResponseEntity<ResultViewModel<List<MaintenanceRequestViewDTO>>> getAllRequests(
            @RequestParam(required = false) EnDateFilter dateFilter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) EnMaintenanceRequestState state
    ) {
        log.info("id entity: {}", currentUserService.getUserEntityId());
        MaintenanceRequestFilter filter = MaintenanceRequestFilter.builder()
                .dateFilter(dateFilter != null ? dateFilter : EnDateFilter.ALL)
                .from(from)
                .to(to)
                .state(state)
                .clientId(currentUserService.getUserEntityId())
                .build();

        filter.validate();

        var requests = service.getAll(filter);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultViewModel<MaintenanceRequestViewDTO>> getById(@PathVariable Integer id) {
        var request = service.getById(id, currentUserService.getUserEntityId());

        return ResponseEntity.status(HttpStatus.OK).body(request);
    }

    @PostMapping
    public ResponseEntity<ResultViewModel<MaintenanceRequestViewDTO>> create(@RequestBody MaintenanceRequestInputDTO dto) {
        var created = service.create(dto, currentUserService.getUserEntityId());

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("{id}/approve")
    public ResponseEntity<Void> approveMaintenance(@PathVariable Integer id) {
        service.approve(id, currentUserService.getUserEntityId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("{id}/reject")
    public ResponseEntity<Void> rejectMaintenance(@PathVariable Integer id, RejectionInfo rejectionInfo) {
        service.reject(id, currentUserService.getUserEntityId(), rejectionInfo);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("{id}/pay")
    public ResponseEntity<Void> payMaintenance(@PathVariable Integer id) {
        service.pay(id, currentUserService.getUserEntityId());

        return ResponseEntity.noContent().build();
    }
}
