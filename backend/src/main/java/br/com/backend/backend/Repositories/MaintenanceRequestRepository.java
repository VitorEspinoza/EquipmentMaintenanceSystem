package br.com.backend.backend.Repositories;

import br.com.backend.backend.DTOs.MaintenanceRequest.RevenueReportDTO;
import br.com.backend.backend.Entities.MaintenanceRequest;
import br.com.backend.backend.ExternalServices.Report.Interfaces.DataInterface;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Integer>, JpaSpecificationExecutor<MaintenanceRequest> {
    @Query(value = """
        SELECT 
            DATE(paid_at) AS revenueDate,
            COUNT(*) AS quantity,
            SUM(quoted_value) AS total
        FROM maintenance_request
        WHERE (:startDate IS NULL OR paid_at >= :startDate)
          AND (:endDate IS NULL OR paid_at <= :endDate)
          AND paid_at IS NOT NULL
        GROUP BY DATE(paid_at)
        ORDER BY revenueDate
    """, nativeQuery = true)
    List<DataInterface> getRevenueReport(LocalDate startDate, LocalDate endDate);

    @Query(value = """
        SELECT 
            DATE(paid_at) AS revenueDate,
            COUNT(*) AS quantity,
            SUM(quoted_value) AS total
        FROM maintenance_request
        WHERE paid_at IS NOT NULL
        GROUP BY DATE(paid_at)
        ORDER BY revenueDate
    """, nativeQuery = true)
    List<DataInterface> getRevenueReport();
}



