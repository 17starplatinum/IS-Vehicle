package ru.ifmo.se.dto.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleRequest {
    @NotNull
    private String name;

    @NotNull
    @Valid
    private CoordinatesRequest coordinates;

    @NotNull
    private String type;

    private Double enginePower;

    @NotNull
    private Integer numberOfWheels;

    @NotNull
    private Integer capacity;

    @NotNull
    private Double distanceTravelled;

    @NotNull
    private Long fuelConsumption;

    @NotNull
    private String fuelType;
}
