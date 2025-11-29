package ru.ifmo.se.validation.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import ru.ifmo.se.validation.EnumValidator;

import java.lang.annotation.*;

@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EnumValidator.class)
@Documented
public @interface ValidEnum {
    String message() default "Invalid enum value";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    Class<? extends Enum<?>> enumClass();
    boolean ignoreCase() default true;
}