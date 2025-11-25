package ru.ifmo.se.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ru.ifmo.se.validation.annotations.ValidEnum;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class EnumValidator implements ConstraintValidator<ValidEnum, String> {
    private Set<String> enumValues;
    private boolean ignoreCase;
    private String messageTemplate;

    @Override
    public void initialize(ValidEnum constraintAnnotation) {
        this.ignoreCase = constraintAnnotation.ignoreCase();
        this.messageTemplate = constraintAnnotation.message();

        Class<? extends Enum<?>> enumClass = constraintAnnotation.enumClass();
        Enum<?>[] enumConstants = enumClass.getEnumConstants();
        this.enumValues = Arrays.stream(enumConstants)
                .map(e -> ignoreCase ? e.name().toLowerCase() : e.name())
                .collect(Collectors.toSet());
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        String testValue = ignoreCase ? value.toLowerCase() : value;
        boolean isValid = enumValues.contains(testValue);

        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                    messageTemplate.replace("${validValues}", String.join(", ", enumValues))
            ).addConstraintViolation();
        }

        return isValid;
    }
}
