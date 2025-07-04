package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceInfo;
import br.com.backend.backend.DTOs.MaintenanceRequest.MaintenanceRequestViewDTO;
import br.com.backend.backend.DTOs.MaintenanceRequest.QuoteInputDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Enums.EnMaintenanceRequestState;
import br.com.backend.backend.Enums.EnDateFilter;
import br.com.backend.backend.Filters.MaintenanceRequestFilter;
import br.com.backend.backend.Services.CurrentUserService;
import br.com.backend.backend.Services.Interfaces.EmployeeMaintenanceRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/employee/maintenance-request")
public class EmployeeMaintenanceRequestController {

    private final EmployeeMaintenanceRequestService service;
    private final CurrentUserService currentUserService;

    @GetMapping
    public ResponseEntity<ResultViewModel<List<MaintenanceRequestViewDTO>>> getAllRequests(
            @RequestParam(required = false) EnDateFilter dateFilter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) EnMaintenanceRequestState state
    ) {
        log.info("idLogged");
        MaintenanceRequestFilter filter = MaintenanceRequestFilter.builder()
                .dateFilter(dateFilter != null ? dateFilter : EnDateFilter.ALL)
                .from(from)
                .to(to)
                .state(state)
                .employeeId(currentUserService.getUserEntityId())
                .build();

        filter.validate();
        
        var requests = service.getAll(filter);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultViewModel<MaintenanceRequestViewDTO>> GetById(@PathVariable Integer id) {
        var request = service.getById(id);

        return ResponseEntity.status(HttpStatus.OK).body(request);
    }

    @PostMapping("{id}/quote")
    public ResponseEntity<Void> QuoteMaintenance(@PathVariable Integer id, @RequestBody QuoteInputDTO quoteInfo) {
        service.quote(id, quoteInfo.price(), currentUserService.getUserEntityId());

        return ResponseEntity.noContent().build();
    }

    @PostMapping("{id}/do-maintenance")
    public ResponseEntity<Void> DoMaintenance(@PathVariable Integer id, @RequestBody MaintenanceInfo maintenanceInfo) {
        service.doMaintenance(id, currentUserService.getUserEntityId(), maintenanceInfo);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("{id}/finalize")
    public ResponseEntity<Void> FinalizeMaintenance(@PathVariable Integer id) {
        service.finalizeMaintenance(id, currentUserService.getUserEntityId());

        return ResponseEntity.noContent().build();
    }

    @PostMapping("{id}/redirect")
    public ResponseEntity<Void> RedirectEmployee(@PathVariable Integer id, @RequestParam Integer newEmployeeId) {
        service.redirectEmployee(id, newEmployeeId);

        return ResponseEntity.noContent().build();
    }
}
