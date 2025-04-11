package br.com.backend.backend.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "equipment_category")
@NoArgsConstructor(access = AccessLevel.PROTECTED)

@Getter
public class EquipmentCategory {

    private EquipmentCategory(String name, String description) {
        this.name = name;
        this.description = description;
        this.active = true;
        this.equipments = new HashSet<>();
    }

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

    public static EquipmentCategory create(String name, String description) {
        return new EquipmentCategory(name, description);
    }

    public void update(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public void inactivate() {
        this.active = false;
    }

}
