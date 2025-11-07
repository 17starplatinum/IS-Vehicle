package ru.ifmo.se.dto.responses;

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
    private String name;
    private Date creationDate;
    private CoordinatesResponse coordinatesResponse;
    private VehicleType type;
    private double enginePower;
    private int numberOfWheels;
    private int capacity;
    private double distanceTravelled;
    private long fuelConsumption;
    private FuelType fuelType;
}
