package br.com.backend.backend.Entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "equipment_category")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class EquipmentCategory {

    public EquipmentCategory(String name, String description) {
        this.name = name;
        this.description = description;
        this.active = true;
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
    
    public void update(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public void inactivate() {
        this.active = false;
    }

}
