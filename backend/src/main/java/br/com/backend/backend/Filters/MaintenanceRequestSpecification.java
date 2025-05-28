package br.com.backend.backend.Filters;

import br.com.backend.backend.Entities.MaintenanceRequest;
import br.com.backend.backend.Enums.EnDateFilter;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class MaintenanceRequestSpecification {

    public static Specification<MaintenanceRequest> withFilter(MaintenanceRequestFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getDateFilter() == EnDateFilter.TODAY) {
                predicates.add(cb.equal(cb.function("date", LocalDate.class, root.get("createdAt")), LocalDate.now()));
            } else if (filter.getDateFilter() == EnDateFilter.DATE_RANGE) {
                predicates.add(cb.between(cb.function("date", LocalDate.class, root.get("createdAt")), filter.getFrom(), filter.getTo()));
            }

            if (filter.getState() != null) {
                predicates.add(cb.equal(root.get("state"), filter.getState()));
            }

            if (filter.getEmployeeId() != null) {
                Predicate redirected = cb.equal(root.get("state"), "REDIRECTED");
                Predicate assignedTo = cb.equal(root.get("assignedToEmployee").get("id"), filter.getEmployeeId());
                Predicate redirectedAssigned = cb.and(redirected, assignedTo);

                Predicate notRedirected = cb.notEqual(root.get("state"), "REDIRECTED");
                predicates.add(cb.or(notRedirected, redirectedAssigned));
            }

            query.orderBy(cb.asc(root.get("createdAt")));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
