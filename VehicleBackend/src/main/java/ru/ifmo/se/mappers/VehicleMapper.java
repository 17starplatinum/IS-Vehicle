package ru.ifmo.se.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import ru.ifmo.se.dto.requests.VehicleRequest;
import ru.ifmo.se.dto.responses.VehicleResponse;
import ru.ifmo.se.entities.Coordinates;
import ru.ifmo.se.entities.FuelType;
import ru.ifmo.se.entities.Vehicle;
import ru.ifmo.se.entities.VehicleType;
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

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "coordinates", source = "coordinates")
    @Mapping(target = "type", qualifiedByName = "vehicleTypeConverter")
    @Mapping(target = "fuelType", qualifiedByName = "fuelTypeConverter")
    Vehicle toEntity(VehicleRequest vehicleRequest, Coordinates coordinates);

    List<VehicleResponse> toResponseList(List<Vehicle> vehicleList);

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
}
