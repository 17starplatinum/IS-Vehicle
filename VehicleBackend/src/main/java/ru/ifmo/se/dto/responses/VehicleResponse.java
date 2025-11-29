package ru.ifmo.se.dto.responses;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ifmo.se.entities.FuelType;
import ru.ifmo.se.entities.VehicleType;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleResponse {
    private long id;
    @NotBlank
    private String name;
    @NotNull
    @PastOrPresent
    private Date creationDate;
    @Valid
    @NotNull
    private CoordinatesResponse coordinates;
    @NotNull
    private VehicleType type;
    @Positive
    private Double enginePower;
    @Positive
    private int numberOfWheels;
    @Positive
    private int capacity;
    @PositiveOrZero
    private double distanceTravelled;
    @Positive
    private long fuelConsumption;
    @NotNull
    private FuelType fuelType;
}
