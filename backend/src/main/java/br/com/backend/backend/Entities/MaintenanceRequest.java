package br.com.backend.backend.Entities;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "state", nullable = false, length = 25)
    private String state;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_equipment", nullable = false)
    private Equipment equipment;

    @Column(name = "defect_description", nullable = false, length = 255)
    private String defectDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_client", nullable = false)
    private Client client;

    @Column(name = "rejection_reason", length = 255)
    private String rejectionReason;

    @Column(name = "budget_price", precision = 10, scale = 2)
    private BigDecimal budgetPrice;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
}