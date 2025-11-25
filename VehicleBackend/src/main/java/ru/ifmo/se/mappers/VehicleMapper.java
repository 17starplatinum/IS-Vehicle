package ru.ifmo.se.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import ru.ifmo.se.dto.requests.VehicleRequest;
import ru.ifmo.se.dto.responses.CoordinatesResponse;
import ru.ifmo.se.dto.responses.DatabaseFunctionResult;
import ru.ifmo.se.dto.responses.VehicleResponse;
import ru.ifmo.se.entities.Coordinates;
import ru.ifmo.se.entities.FuelType;
import ru.ifmo.se.entities.Vehicle;
import ru.ifmo.se.entities.VehicleType;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Mapper(
        componentModel = "cdi",
        config = BaseMapper.class,
        uses = {CoordinatesMapper.class},
        unmappedTargetPolicy = org.mapstruct.ReportingPolicy.ERROR
)
public interface VehicleMapper {
    @Mapping(target = "coordinates", source = "coordinates")
    VehicleResponse toResponse(Vehicle vehicle);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "coordinates", source = "coordinates")
    @Mapping(target = "type", qualifiedByName = "vehicleTypeConverter")
    @Mapping(target = "fuelType", qualifiedByName = "fuelTypeConverter")
    Vehicle fromRequest(VehicleRequest vehicleRequest);

    List<VehicleResponse> toResponseList(List<Vehicle> vehicleList);

    @Mapping(target = "type", qualifiedByName = "vehicleTypeConverter")
    @Mapping(target = "fuelType", qualifiedByName = "fuelTypeConverter")
    default VehicleResponse toResponseFromFunctionResult(DatabaseFunctionResult result) {
        try {
            CoordinatesMapper coordinatesMapper = CoordinatesMapper.INSTANCE;
            CoordinatesResponse coordinates = coordinatesMapper.toResponse(
                    new Coordinates(
                    result.get(3, Long.class),  // id
                    result.get(4, Long.class),  // x
                    result.get(5, Double.class) // y
                    )
            );

            return new VehicleResponse(
                    result.get(0, Long.class),  // id
                    result.get(1, String.class), // name
                    convertTimestampToDate(result.get(2, Timestamp.class)), // creation_date
                    coordinates,
                    vehicleTypeConverter(result.get(6, String.class)), // type
                    result.get(7, Double.class), // engine_power
                    result.get(8, Integer.class), // number_of_wheels
                    result.get(9, Integer.class), // capacity
                    result.get(10, Double.class), // distance_travelled
                    result.get(11, Long.class), // fuel_consumption
                    fuelTypeConverter(result.get(12, String.class)) // fuel_type
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to map database result to DTO", e);
        }
    }

    @Named("vehicleTypeConverter")
    default VehicleType vehicleTypeConverter(String vehicleType) {
        if (vehicleType == null || vehicleType.trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle type cannot be null or empty");
        }
        try {
            return VehicleType.valueOf(vehicleType.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid vehicle type: " + vehicleType +
                    ". Valid types: " + java.util.Arrays.toString(VehicleType.values()));
        }
    }

    @Named("fuelTypeConverter")
    default FuelType fuelTypeConverter(String fuelType) {
        if (fuelType == null || fuelType.trim().isEmpty()) {
            throw new IllegalArgumentException("Fuel type cannot be null or empty");
        }
        try {
            return FuelType.valueOf(fuelType.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid fuel type: " + fuelType +
                    ". Valid types: " + java.util.Arrays.toString(FuelType.values()));
        }
    }

    default Date convertTimestampToDate(Timestamp timestamp) {
        return timestamp != null ? new Date(timestamp.getTime()) : null;
    }
}
