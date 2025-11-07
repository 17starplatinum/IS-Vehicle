package ru.ifmo.se.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.Instant;
import java.util.Date;

@Entity
@Table
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Поле 'name' не может быть null и пустым")
    private String name;

    @OneToOne(mappedBy = "id", cascade = CascadeType.ALL)
    @JoinColumn(name = "coordinates_id", nullable = false, referencedColumnName = "id")
    private Coordinates coordinates;

    @Builder.Default
    @NotNull(message = "Поле даты создания не может быть null")
    @Column(updatable = false, nullable = false)
    private java.util.Date creationDate = Date.from(Instant.now());

    @NotNull(message = "Поле 'type' не может быть null")
    @Enumerated(EnumType.STRING)
    private VehicleType type;

    @Positive(message = "Значение поля 'enginePower' должно быть больше 0")
    private Double enginePower;

    @NotNull(message = "Поле 'enginePower' не может быть null")
    @Positive(message = "Значение поля 'numberOfWheels' должно быть больше 0")
    private Integer numberOfWheels;

    @NotNull(message = "Поле 'capacity' не может быть null")
    @Positive(message = "Значение поля 'capacity' должно быть больше 0")
    private Integer capacity;

    @NotNull(message = "Поле 'distanceTravelled' не может быть null")
    @Positive(message = "Значение поля 'distanceTravelled' должно быть больше 0")
    private Double distanceTravelled;

    @NotNull(message = "Поле 'fuelConsumption' не может быть null")
    @Positive(message = "Значение поля 'fuelConsumption' должно быть больше 0")
    private Long fuelConsumption;

    @NotNull(message = "Поле 'fuelType' не может быть null")
    @Enumerated(EnumType.STRING)
    private FuelType fuelType;
}
