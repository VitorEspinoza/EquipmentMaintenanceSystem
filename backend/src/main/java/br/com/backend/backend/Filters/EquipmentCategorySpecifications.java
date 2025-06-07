package br.com.backend.backend.Filters;

import br.com.backend.backend.Entities.Employee;
import br.com.backend.backend.Entities.EquipmentCategory;
import org.springframework.data.jpa.domain.Specification;

public class EquipmentCategorySpecifications {

    public static Specification<EquipmentCategory> isActive(Boolean active) {
        return (root, query, cb) -> active == null ? null : cb.equal(root.get("active"), active);
    }
}
