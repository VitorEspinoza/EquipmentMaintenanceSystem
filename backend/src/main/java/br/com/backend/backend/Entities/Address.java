package br.com.backend.backend.Entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "address")
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access=AccessLevel.PROTECTED)
@Getter
public class Address {

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

    public static Address create(
            String zipcode,
            String neighbourhood,
            String street,
            String city,
            String state,
            String number,
            String complement
    ) {
        return new Address(
                null,
                zipcode,
                neighbourhood,
                street,
                city,
                state,
                number,
                complement
        );
    }

}
