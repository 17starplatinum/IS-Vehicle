package ru.ifmo.se.validation.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import ru.ifmo.se.validation.coordinates.CoordinatesRequestValidator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CoordinatesRequestValidator.class)
public @interface ValidCoordinatesRequest {
    String message() default "Invalid coordinates request: either id must be null or both x and y must be null";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
