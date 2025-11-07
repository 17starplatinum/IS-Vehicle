package ru.ifmo.se.services.api;

import ru.ifmo.se.dto.requests.CoordinatesRequest;
import ru.ifmo.se.dto.responses.CoordinatesResponse;

import java.util.List;

public interface CoordinatesService {
    List<CoordinatesResponse> getCoordinates(Integer page, Integer size, String sortBy, Boolean ascending);
    CoordinatesResponse getCoordinatesById(Long id);
    CoordinatesResponse saveCoordinates(CoordinatesRequest request);
    CoordinatesResponse updateCoordinates(Long id, CoordinatesRequest coordinatesRequest);
    void deleteCoordinatesById(Long id);
}
