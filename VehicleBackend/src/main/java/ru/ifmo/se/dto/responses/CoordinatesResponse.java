package ru.ifmo.se.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoordinatesResponse {
    private long id;
    private long x;
    private double y;
}
