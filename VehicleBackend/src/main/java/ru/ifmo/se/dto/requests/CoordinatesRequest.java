package ru.ifmo.se.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ifmo.se.validation.annotations.ValidCoordinatesRequest;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ValidCoordinatesRequest
public class CoordinatesRequest {
    private Long id;
    private Long x;
    private Double y;
}
