package ru.ifmo.se.dto.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ifmo.se.entities.FuelType;
import ru.ifmo.se.entities.VehicleType;
import ru.ifmo.se.validation.annotations.ValidEnum;

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
    @ValidEnum(enumClass = VehicleType.class, message = "Invalid vehicle type. Must be one of: ${validValues}")
    private String type;

    @Positive
    private Double enginePower;

    @NotNull
    @Positive
    private Integer numberOfWheels;

    @NotNull
    @Positive
    private Integer capacity;

    @NotNull
    @PositiveOrZero
    private Double distanceTravelled;

    @NotNull
    @Positive
    private Long fuelConsumption;

    @NotNull
    @ValidEnum(enumClass = FuelType.class, message = "Invalid fuel type. Must be one of: ${validValues}")
    private String fuelType;
}
