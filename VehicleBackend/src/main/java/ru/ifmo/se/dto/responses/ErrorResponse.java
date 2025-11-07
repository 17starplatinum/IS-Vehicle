package ru.ifmo.se.dto.responses;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ErrorResponse {
    private int code;
    private String message;
    private String time;

    public ErrorResponse(int code, String message) {
        this.code = code;
        this.message = message;
        this.time = Instant.now().toString();
    }
}