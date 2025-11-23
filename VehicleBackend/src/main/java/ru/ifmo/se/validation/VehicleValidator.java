package ru.ifmo.se.validation;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.ValidationException;
import lombok.Getter;
import ru.ifmo.se.dto.requests.VehicleRequest;
import ru.ifmo.se.entities.FuelType;
import ru.ifmo.se.entities.VehicleType;
import ru.ifmo.se.exceptions.CustomValidationException;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@ApplicationScoped
public class VehicleValidator implements RequestValidator<VehicleRequest> {

    @Inject
    private CoordinatesValidator coordinatesValidator;

    @Getter
    Set<String> validFields = new HashSet<>(Arrays.asList(
            "id", "name", "type", "enginePower", "numberOfWheels",
            "capacity", "distanceTravelled", "fuelConsumption", "fuelType",
            "coordinatesId"
    ));
    @Override
    public void validateId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Vehicle id must not be null");
        }
        if (id < 1) {
            throw new IllegalArgumentException("Vehicle id must be greater than or equal to 1");
        }
    }

    @Override
    public boolean validateGetParameters(Integer page, Integer size, Boolean ascending) {
        if (page < 1) {
            throw new IllegalArgumentException("Vehicle page number must be greater than or equal to 1");
        }
        if (size < 1) {
            throw new IllegalArgumentException("Vehicle page size must be greater than or equal to 1");
        }
        if (ascending == null) {
            return true;
        }
        return ascending;
    }

    @Override
    public boolean isValidSortField(String field) {
        return validFields.contains(field);
    }

    @Override
    public void validateRequest(VehicleRequest request) {
        if (request == null) {
            throw new ValidationException("Vehicle request cannot be null");
        }

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new ValidationException("Vehicle name cannot be empty");
        }

        if (request.getType() == null) {
            throw new ValidationException("Vehicle type cannot be null");
        }
        try {
            VehicleType.fromValue(request.getType());
            FuelType.fromValue(request.getFuelType());
        } catch (IllegalArgumentException e) {
            throw new CustomValidationException(e.getMessage());
        }

        if (request.getCoordinates() != null) {
            coordinatesValidator.validateRequest(request.getCoordinates());
        } else {
            throw new ValidationException("Coordinates cannot be null");
        }

        validatePositiveField(request.getEnginePower(), "Engine Power");
        validatePositiveField(request.getNumberOfWheels(), "Number of wheels");
        validatePositiveField(request.getCapacity(), "Capacity");
        validatePositiveField(request.getDistanceTravelled(), "Distance travelled");
        validatePositiveField(request.getFuelConsumption(), "Fuel consumption");
    }

    private void validatePositiveField(Number value, String fieldName) {
        if (value == null && !Objects.equals(fieldName, "Engine Power")) {
            throw new NullPointerException(fieldName + " must not be null");
        }

        // Если Engine Power всё-таки null
        if (value == null) {
            return;
        }

        if (value.doubleValue() <= 0) {
            throw new ValidationException(fieldName + " value must be at least equal to 1");
        }
    }
}
