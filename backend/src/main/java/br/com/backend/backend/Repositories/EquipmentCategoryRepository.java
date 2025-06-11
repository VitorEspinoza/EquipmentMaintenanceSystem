package br.com.backend.backend.Repositories;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;
import br.com.backend.backend.Entities.EquipmentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentCategoryRepository extends JpaRepository<EquipmentCategory, Integer>, JpaSpecificationExecutor<EquipmentCategory> {
    Optional<EquipmentCategory> findByNameIgnoreCase(String name);

    @NonNull
    Optional<EquipmentCategory> findById(Integer id);

    @NonNull
    List<EquipmentCategory> findAll();
}
