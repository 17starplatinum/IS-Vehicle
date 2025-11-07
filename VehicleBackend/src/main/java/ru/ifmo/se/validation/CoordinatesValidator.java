package ru.ifmo.se.validation;

import jakarta.enterprise.context.ApplicationScoped;
import ru.ifmo.se.dto.requests.CoordinatesRequest;
import ru.ifmo.se.exceptions.CustomValidationException;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@ApplicationScoped
public class CoordinatesValidator implements RequestValidator<CoordinatesRequest> {
    @Override
    public void validateId(Long id) {
        if (id == null) {
            throw new CustomValidationException("Coordinates id must not be null");
        }
        if (id < 1) {
            throw new CustomValidationException("Coordinates id must be greater than or equal to 1");
        }
    }

    @Override
    public boolean validateGetParameters(Integer page, Integer size, Boolean ascending) {
        if (page < 1) {
            throw new CustomValidationException("Page number must be greater than or equal to 1");
        }
        if (size < 1) {
            throw new CustomValidationException("Page size must be greater than or equal to 1");
        }
        if (ascending == null) {
            return true;
        }
        return ascending;
    }

    @Override
    public void validateRequest(CoordinatesRequest request) {
        if (request == null) {
            throw new CustomValidationException("Coordinates must not be null");
        }
        if (request.getX() == null) {
            throw new CustomValidationException("X must not be null");
        }
        if (request.getY() == null) {
            throw new CustomValidationException("Y must not be null");
        }
    }

    @Override
    public boolean isValidSortField(String field) {
        Set<String> validFields = new HashSet<>(Arrays.asList(
                "id", "x", "y"
        ));
        return validFields.contains(field);
    }
}
