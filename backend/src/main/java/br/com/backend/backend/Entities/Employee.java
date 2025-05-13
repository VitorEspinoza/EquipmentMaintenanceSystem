package br.com.backend.backend.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "employee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    public Employee (Account account, String name, LocalDate birthDate) {
        this.account = account;
        this.name = name;
        this.birthDate = birthDate;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_account", nullable = false)
    private Account account;

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    public void update(String name, String email, String role, LocalDate birthDate) {
        this.name = name;
        this.birthDate = birthDate;
        this.account.setEmail(email);
        this.account.setRole(role);
    }

    public void inactivate() {
        this.account.setActive(false);
    }
}