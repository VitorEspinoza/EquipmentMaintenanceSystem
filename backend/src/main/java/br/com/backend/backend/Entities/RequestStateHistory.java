package br.com.backend.backend.Entities;

import br.com.backend.backend.Enums.EnMaintenanceRequestState;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "request_state_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestStateHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_request", nullable = false)
    private MaintenanceRequest request;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_state", length = 20)
    private EnMaintenanceRequestState previousState;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_state", nullable = false, length = 20)
    private EnMaintenanceRequestState newState;

    @Column(name = "change_date", nullable = false)
    private LocalDateTime changeDate;
}