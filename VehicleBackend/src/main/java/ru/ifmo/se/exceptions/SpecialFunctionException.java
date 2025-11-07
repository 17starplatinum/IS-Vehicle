package ru.ifmo.se.exceptions;

@HttpStatus(500)
public class SpecialFunctionException extends RuntimeException {
    public SpecialFunctionException(String message, Throwable cause) {
        super(message, cause);
    }
}
