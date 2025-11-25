package ru.ifmo.se.validation;

import jakarta.enterprise.context.ApplicationScoped;
import lombok.Getter;
import ru.ifmo.se.dto.requests.VehicleRequest;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@ApplicationScoped
public class VehicleValidator extends GenericRequestValidator<VehicleRequest> {
    @Getter
    private static final Set<String> validFields = new HashSet<>(Arrays.asList(
            "id", "name", "type", "enginePower", "numberOfWheels",
            "capacity", "distanceTravelled", "fuelConsumption", "fuelType",
            "coordinatesId"
    ));

    @Override
    public boolean isValidSortField(String field) {
        if (field == null || field.trim().isEmpty()) {
            return true;
        }
        return !validFields.contains(field.trim().toLowerCase());
    }
}
