package br.com.backend.backend.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "equipment_category")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)

@Getter
public class EquipmentCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "active")
    private Boolean active;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private Set<Equipment> equipments;

    public static EquipmentCategory create(String name, String description, boolean active) {
        return new EquipmentCategory(null, name, description, active, new HashSet<>());
    }
}
