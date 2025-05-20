package br.com.backend.backend.Entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "equipment")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
public class Equipment {

    public Equipment(String description, EquipmentCategory category) {
        this.description = description;
        this.category = category;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "description_equipment")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_equipment_category")
    private EquipmentCategory category;

}
