package br.com.backend.backend.Entities;

import br.com.backend.backend.Enums.EnMaintenanceRequestState;
import br.com.backend.backend.Exceptions.Custom.InvalidQuoteValueException;
import br.com.backend.backend.Exceptions.Custom.InvalidStateTransitionException;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "maintenance_request")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MaintenanceRequest {
    public MaintenanceRequest(String equipmentDescription, EquipmentCategory equipmentCategory, Client client, String defectDescription) {
        this.description = equipmentDescription;
        this.category = equipmentCategory;
        this.client = client;
        this.defectDescription = defectDescription;
        this.state = EnMaintenanceRequestState.OPEN;
        this.createdAt = LocalDateTime.now();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "state", nullable = false, length = 25)
    @Enumerated(EnumType.STRING)
    private EnMaintenanceRequestState state;
    
    @Column(name = "equipment_description", nullable = false, length = 255)
    private String description;

    @Column(name = "defect_description", nullable = false, length = 255)
    private String defectDescription;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_equipment_category", nullable = false)
    private EquipmentCategory category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_client", nullable = false)
    private Client client;
    
    @Column(name = "quoted_value", precision = 10, scale = 2)
    private BigDecimal quotedValue;

    @Column(name = "maintenance_description", nullable = false, length = 255)
    private String maintenanceDescription;

    @Column(name = "maintenance_completed_at")
    private LocalDateTime maintenanceCompletedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maintenance_employee_id")
    private Employee maintenanceEmployee;
    
    @Column(name = "customer_guidelines", nullable = false, length = 255)
    private String customerGuidelines;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quoted_by_employee_id")
    private Employee quotedByEmployee;

    @Column(name = "quoted_at")
    private LocalDateTime quotedAt;
    
    
    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "finalized_at")
    private LocalDateTime finalizedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "finalized_by_employee_id")
    private Employee finalizedByEmployee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_employee_id")
    private Employee assignedToEmployee;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;
    
    @Column(name = "rejection_reason", length = 255)
    private String rejectionReason;


    @OneToMany(mappedBy = "maintenanceRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("changedAt ASC")
    private final List<RequestStateHistory> stateHistory = new ArrayList<>();

    private void validateTransition(EnMaintenanceRequestState newState) {
        if (!this.state.canTransitionTo(newState)) {
            throw new InvalidStateTransitionException(this.state, newState);
        }
    }
    private void transitionTo(EnMaintenanceRequestState newState) {
        validateTransition(newState);
        this.state = newState;
        addStateHistory();
    }
    private void addStateHistory() {
        var history =  new RequestStateHistory(this, this.state, this.assignedToEmployee);
        stateHistory.add(history);
        
    }
    public void Quote(BigDecimal value, Employee employee) {
        if(value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidQuoteValueException("Quote value must be greater than zero");
        }

        quotedValue = value;
        quotedAt = LocalDateTime.now();
        quotedByEmployee = employee;
        assignedToEmployee = employee;
        transitionTo(EnMaintenanceRequestState.QUOTED);
    }
    
    public void Approve() {
        approvedAt = LocalDateTime.now();
        transitionTo(EnMaintenanceRequestState.APPROVED);
    }

    public void Reject(String reason) {
        rejectedAt = LocalDateTime.now();
        rejectionReason = reason;
        transitionTo(EnMaintenanceRequestState.REJECTED);
    }

    public void Pay() {
        paidAt = LocalDateTime.now();
        transitionTo(EnMaintenanceRequestState.PAID);
    }

    public void RedirectEmployee(Employee newEmployee) {
        assignedToEmployee = newEmployee;
        transitionTo(EnMaintenanceRequestState.REDIRECTED);
        
    }

    public void DoMaintenance(Employee employee, String description, String customerGuidelines) {
        maintenanceCompletedAt = LocalDateTime.now();
        maintenanceEmployee = employee;
        maintenanceDescription = description;
        this.customerGuidelines = customerGuidelines;
        transitionTo(EnMaintenanceRequestState.FIXED);
    }
    
    public void Finalize(Employee employee) {
        finalizedAt = LocalDateTime.now();
        finalizedByEmployee = employee;
        transitionTo(EnMaintenanceRequestState.COMPLETED);
    }
}