package br.com.backend.backend.Entities;

import br.com.backend.backend.Enums.EnMaintenanceRequestState;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "request_state_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class RequestStateHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_request", nullable = false)
    private MaintenanceRequest maintenanceRequest;

    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false)
    private EnMaintenanceRequestState state;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_employee_id")
    private Employee changedByEmployee;
    
    public RequestStateHistory(MaintenanceRequest request, EnMaintenanceRequestState state,
                               Employee employee) {
        this.maintenanceRequest = request;
        this.state = state;
        this.changedByEmployee = employee;
        this.changedAt = LocalDateTime.now();
    }
}