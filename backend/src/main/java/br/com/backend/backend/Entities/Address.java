package br.com.backend.backend.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "address")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Address {

    public Address(String zipcode, String neighbourhood, String street, String city, String state, String number, String complement) {
        this.zipcode = zipcode;
        this.neighbourhood = neighbourhood;
        this.street = street;
        this.city = city;
        this.state = state;
        this.number = number;
        this.complement = complement;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "zipcode")
    private String zipcode;

    @Column(name = "neighbourhood")
    private String neighbourhood;

    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "number")
    private String number;

    @Column(name = "complement")
    private String complement;
}
