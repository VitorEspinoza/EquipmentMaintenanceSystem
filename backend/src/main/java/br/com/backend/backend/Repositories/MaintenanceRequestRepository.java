package br.com.backend.backend.Repositories;

import br.com.backend.backend.Entities.MaintenanceRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;
import org.springframework.lang.NonNullApi;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Integer>, JpaSpecificationExecutor<MaintenanceRequest> {
    @EntityGraph(attributePaths = {"category", "client", "assignedToEmployee", "stateHistory"})
    Optional<MaintenanceRequest> findByIdAndClient_Id(Integer id, Integer clientId);

    @EntityGraph(attributePaths = {"category", "client", "assignedToEmployee", "stateHistory"})
    @NonNull
    Optional<MaintenanceRequest> findById(@NonNull Integer id);
}



