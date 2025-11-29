package ru.ifmo.se.validation.coordinates;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ru.ifmo.se.dto.requests.CoordinatesRequest;
import ru.ifmo.se.validation.annotations.ValidCoordinatesRequest;

public class CoordinatesRequestValidator implements ConstraintValidator<ValidCoordinatesRequest, CoordinatesRequest> {

    @Override
    public void initialize(ValidCoordinatesRequest constraintAnnotation) {
    }

    @Override
    public boolean isValid(CoordinatesRequest request, ConstraintValidatorContext context) {
        if (request == null) {
            return true;
        }
        boolean idIsNull = request.getId() == null;
        boolean xyAreNull = request.getX() == null && request.getY() == null;
        boolean isValid = (idIsNull && !xyAreNull) || (!idIsNull && xyAreNull);
        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                    "Invalid coordinates request: must provide either 'id' OR 'x' and 'y' coordinates, but not both"
            ).addConstraintViolation();
        }
        return isValid;
    }
}
