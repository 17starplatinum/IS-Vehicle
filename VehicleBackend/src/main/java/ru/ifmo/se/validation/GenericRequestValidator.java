package ru.ifmo.se.validation;

import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import jakarta.validation.Validator;

import java.util.Set;

public class GenericRequestValidator<T> implements RequestValidator<T>{

    @Inject
    protected Validator validator;
    @Override
    public void validateId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID must not be null");
        }
        if (id < 1) {
            throw new IllegalArgumentException("ID must be greater than or equal to 1");
        }
    }

    @Override
    public boolean validateGetParameters(Integer page, Integer size, Boolean ascending) {
        if (page < 1) {
            throw new IllegalArgumentException("Page number must be greater than or equal to 1");
        }
        if (size < 1) {
            throw new IllegalArgumentException("Page size must be greater than or equal to 1");
        }
        return ascending != null ? ascending : true;
    }

    @Override
    public boolean isValidSortField(String field) {
        return true;
    }

    @Override
    public void validateRequest(T request) {
        Set<ConstraintViolation<T>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
    }

    @Override
    public void validateRange(Double min, Double max) {
        if (min == null || max == null) {
            throw new ValidationException("Min and max values are mandatory.");
        }
        if (min <= 0 || max <= 0) {
            throw new ValidationException("Min and max values must be positive.");
        }
        if (min >= max) {
            throw new ValidationException("Max must be greater than min.");
        }
    }
}
