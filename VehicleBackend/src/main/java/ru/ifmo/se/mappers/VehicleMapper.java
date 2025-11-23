package ru.ifmo.se.mappers;

import jakarta.data.exceptions.MappingException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import ru.ifmo.se.dto.requests.VehicleRequest;
import ru.ifmo.se.dto.responses.CoordinatesResponse;
import ru.ifmo.se.dto.responses.DatabaseFunctionResult;
import ru.ifmo.se.dto.responses.PageResponse;
import ru.ifmo.se.dto.responses.VehicleResponse;
import ru.ifmo.se.entities.FuelType;
import ru.ifmo.se.entities.Vehicle;
import ru.ifmo.se.entities.VehicleType;

import java.security.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Objects;


@Mapper(componentModel = "cdi")
public interface VehicleMapper {
    @Mapping(target = "coordinatesResponse", source = "coordinates")
    VehicleResponse toDto(Vehicle vehicle);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "coordinates", source = "coordinates")
    @Mapping(target = "coordinates.id", ignore = true)
    @Mapping(target = "type", qualifiedByName = "vehicleTypeConverter")
    @Mapping(target = "fuelType", qualifiedByName = "fuelTypeConverter")
    Vehicle fromDto(VehicleRequest vehicleRequest);

    List<VehicleResponse> toDtoList(List<Vehicle> vehicleList);
    PageResponse<VehicleResponse> toDtoPage(List<VehicleResponse> vehicleList, int page, int size, long total);

    @Mapping(target = "type", qualifiedByName = "vehicleTypeConverter")
    @Mapping(target = "fuelType", qualifiedByName = "fuelTypeConverter")
    default VehicleResponse toResponseFromFunctionResult(DatabaseFunctionResult result) {
        try {
            CoordinatesResponse coordinates = new CoordinatesResponse(
                    result.get(3, Long.class),                                                                  // id
                    result.get(4, Long.class),                                                                  // x
                    result.get(5, Double.class)                                                                 // y
            );

            return new VehicleResponse(
                    result.get(0, Long.class),                                                                  // id
                    result.get(1, String.class),                                                                // name
                    convertTimestampToDate(result.get(2, Timestamp.class)),                                     // creation_date
                    coordinates,                                                                                      // coordinatesResponse
                    VehicleType.fromValue(Objects.requireNonNull(result.get(6, String.class)).toUpperCase()),   // type
                    result.get(7, Double.class),                                                                // engine_power
                    result.get(8, Integer.class),                                                               // number_of_wheels
                    result.get(9, Integer.class),                                                               // capacity
                    result.get(10, Double.class),                                                               // distance_travelled
                    result.get(11, Long.class),                                                                 // fuel_consumption
                    FuelType.fromValue(Objects.requireNonNull(result.get(12, String.class)).toUpperCase())      // fuel_type
            );
        } catch (Exception e) {
            throw new MappingException("Failed to map database result to DTO", e);
        }
    }

    @Named(value = "vehicleTypeConverter")
    default VehicleType convertVehicleType(String vehicleType) {
        return VehicleType.fromValue(vehicleType);
    }

    @Named(value = "fuelTypeConverter")
    default FuelType convertFuelType(String fuelType) {
        return FuelType.fromValue(fuelType);
    }

    default Date convertTimestampToDate(Timestamp timestamp) {
        return timestamp != null ? timestamp.getTimestamp() : null;
    }
}
