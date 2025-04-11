package br.com.backend.backend.Repositories;
import org.springframework.lang.NonNull;
import org.springframework.lang.NonNullApi;
import br.com.backend.backend.Entities.EquipmentCategory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EquipmentCategoryRepository extends JpaRepository<EquipmentCategory, Integer> {
    Optional<EquipmentCategory> findByNameIgnoreCase(String name);

    @NonNull
    @EntityGraph(attributePaths = "equipments")
    Optional<EquipmentCategory> findById(Integer id);

    @NonNull
    @EntityGraph(attributePaths = "equipments")
    List<EquipmentCategory> findAll();
}
