package br.com.backend.backend.Filters;

import br.com.backend.backend.Entities.Employee;
import org.springframework.data.jpa.domain.Specification;

public class EmployeeSpecifications {

    public static Specification<Employee> nameContains(String name) {
        return (root, query, cb) -> name == null ? null : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Employee> emailContains(String email) {
        return (root, query, cb) -> email == null ? null : cb.like(cb.lower(root.get("account").get("email")), "%" + email.toLowerCase() + "%");
    }
    
    public static Specification<Employee> isActive(Boolean active) {
        return (root, query, cb) -> active == null ? null : cb.equal(root.get("account").get("active"), active);
    }

    public static Specification<Employee> excludeEmployeeId(Integer employeeId) {
        return (root, query, cb) -> {
            if (employeeId == null) {
                return cb.conjunction();
            }
            return cb.notEqual(root.get("id"), employeeId);
        };
    }
}

