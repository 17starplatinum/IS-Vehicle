package ru.ifmo.se.validation;

public interface RequestValidator<T> {
    void validateId(Long id);
    boolean validateGetParameters(Integer page, Integer size, Boolean ascending);
    boolean isValidSortField(String field);
    void validateRequest(T request);
    void validateRange(Double min, Double max);
}
