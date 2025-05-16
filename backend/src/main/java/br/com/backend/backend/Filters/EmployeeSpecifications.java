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

    public static Specification<Employee> hasRole(String role) {
        return (root, query, cb) -> role == null ? null : cb.equal(cb.lower(root.get("account").get("role")), role.toLowerCase());
    }

    public static Specification<Employee> isActive(Boolean active) {
        return (root, query, cb) -> active == null ? null : cb.equal(root.get("account").get("active"), active);
    }
}

