package br.com.backend.backend.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_maintenance", nullable = false)
    private Maintenance maintenance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_origin_employee", nullable = false)
    private Employee originEmployee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_destination_employee", nullable = false)
    private Employee destinationEmployee;

    @Column(name = "redirectDate", nullable = false)
    private LocalDateTime redirectDate;

    @Column(name = "reason", nullable = false, length = 255)
    private String reason;

}