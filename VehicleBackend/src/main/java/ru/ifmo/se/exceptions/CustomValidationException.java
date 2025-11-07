package ru.ifmo.se.exceptions;

import jakarta.validation.ValidationException;

@HttpStatus(422)
public class CustomValidationException extends ValidationException {
    public CustomValidationException(String message) {
        super(message);
    }
}
