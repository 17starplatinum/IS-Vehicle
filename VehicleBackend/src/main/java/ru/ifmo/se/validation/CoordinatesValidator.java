package ru.ifmo.se.validation;

import jakarta.enterprise.context.ApplicationScoped;
import ru.ifmo.se.dto.requests.CoordinatesRequest;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@ApplicationScoped
public class CoordinatesValidator extends GenericRequestValidator<CoordinatesRequest> {
    private static final Set<String> validFields = new HashSet<>(Arrays.asList("id", "x", "y"));

    @Override
    public boolean isValidSortField(String field) {
        if (field == null || field.trim().isEmpty()) {
            return true;
        }
        return validFields.contains(field);
    }
}
