package br.com.backend.backend.Repositories;

import br.com.backend.backend.Entities.MaintenanceRequest;
import br.com.backend.backend.ExternalServices.Report.Interfaces.RevenueReportByCategoryProjection;
import br.com.backend.backend.ExternalServices.Report.Interfaces.RevenueReportProjection;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Integer>, JpaSpecificationExecutor<MaintenanceRequest> {
    @EntityGraph(attributePaths = {"category", "client", "assignedToEmployee", "stateHistory"})
    Optional<MaintenanceRequest> findByIdAndClient_Id(Integer id, Integer clientId);

    @EntityGraph(attributePaths = {"category", "client", "assignedToEmployee", "stateHistory"})
    @NonNull
    Optional<MaintenanceRequest> findById(@NonNull Integer id);

    @Query(value = """
        SELECT 
            DATE(paid_at) AS revenue_date,
            COUNT(*) AS quantity,
            SUM(quoted_value) AS total
        FROM maintenance_request
        WHERE (DATE(:startDate) IS NULL OR DATE(paid_at) >= DATE(:startDate))
          AND (DATE(:endDate) IS NULL OR DATE(paid_at) <= DATE(:endDate))
          AND paid_at IS NOT NULL
        GROUP BY DATE(paid_at)
        ORDER BY revenue_date
    """, nativeQuery = true)
    List<RevenueReportProjection> getRevenueReport(LocalDate startDate, LocalDate endDate);


    @Query(value = """
        SELECT
            DATE(paid_at) AS revenue_date,
            COUNT(*) AS quantity,
            SUM(quoted_value) AS total
        FROM maintenance_request
        WHERE paid_at IS NOT NULL
        GROUP BY DATE(paid_at)
        ORDER BY revenue_date
    """, nativeQuery = true)
    List<RevenueReportProjection> getRevenueReport();

    @Query(value = """
        SELECT
            ec.name as equipmentCategory,
            COUNT(mr.id) AS quantity,
            SUM(mr.quotedValue) AS total
        FROM MaintenanceRequest mr
        LEFT JOIN mr.category ec
        WHERE mr.state = 'PAID'
        GROUP BY ec.name
        ORDER BY total DESC
    """)
    List<RevenueReportByCategoryProjection> getRevenueByCategoryReport();

}



