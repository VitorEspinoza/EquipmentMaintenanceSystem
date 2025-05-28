package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceInfo;
import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestInputDTO;
import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestViewDTO;
import br.com.backend.backend.DTOs.MaintenanceRequest.RejectionInfo;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Enums.EnMaintenanceRequestState;
import br.com.backend.backend.Enums.EnDateFilter;
import br.com.backend.backend.Filters.MaintenanceRequestFilter;
import br.com.backend.backend.Services.Interfaces.MaintenanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/maintenance-request")
public class MaintenanceRequestController {

    private final MaintenanceRequestService service;

    @GetMapping("/{id}")
    public ResponseEntity<ResultViewModel<MaintenanceRequestViewDTO>> GetById(@PathVariable Integer id) {
        var request = service.GetById(id);

        return ResponseEntity.status(HttpStatus.OK).body(request);
    }
    @GetMapping
    public ResponseEntity<ResultViewModel<List<MaintenanceRequestViewDTO>>> getAllRequests(
            @RequestParam(required = false) EnDateFilter dateFilter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) EnMaintenanceRequestState state,
            @RequestParam Integer employeeId

    ) {
        MaintenanceRequestFilter filter = MaintenanceRequestFilter.builder()
                .dateFilter(dateFilter != null ? dateFilter : EnDateFilter.ALL)
                .from(from)
                .to(to)
                .state(state)
                .employeeId(employeeId)
                .build();

        filter.validate();
        
        var requests = service.GetAll(filter);
        return ResponseEntity.ok(requests);
    }

    @PostMapping
    public ResponseEntity<ResultViewModel<MaintenanceRequestViewDTO>> Create(@RequestBody MaintenanceRequestInputDTO dto, @RequestParam Integer clientId) {
        var created = service.Create(dto, clientId);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("{id}/quote")
    public ResponseEntity<Void> QuoteMaintenance(@PathVariable Integer id, @RequestParam(required = false) BigDecimal price,  @RequestParam Integer employeeId) {
        service.Quote(id, price, employeeId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("{id}/approve")
    public ResponseEntity<Void> ApproveMaintenance(@PathVariable Integer id) {
        service.Approve(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("{id}/reject")
    public ResponseEntity<Void> RejectMaintenance(@PathVariable Integer id, RejectionInfo rejectionInfo) {
        service.Reject(id, rejectionInfo);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("{id}/do-maintenance")
    public ResponseEntity<Void> DoMaintenance(@PathVariable Integer id, @RequestParam Integer employeeId, @RequestBody MaintenanceInfo maintenanceInfo) {
        service.DoMaintenance(id, employeeId, maintenanceInfo);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("{id}/finalize")
    public ResponseEntity<Void> FinalizeMaintenance(@PathVariable Integer id, @RequestParam Integer employeeId) {
        service.FinalizeMaintenance(id, employeeId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("{id}/redirect")
    public ResponseEntity<Void> RedirectEmployee(@PathVariable Integer id, @RequestParam Integer newEmployeeId) {
        service.RedirectEmployee(id, newEmployeeId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("{id}/pay")
    public ResponseEntity<Void> PayMaintenance(@PathVariable Integer id) {
        service.Pay(id);

        return ResponseEntity.noContent().build();
    }
}
