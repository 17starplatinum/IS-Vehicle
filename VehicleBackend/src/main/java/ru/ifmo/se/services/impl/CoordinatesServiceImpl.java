package ru.ifmo.se.services.impl;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import ru.ifmo.se.dto.requests.CoordinatesRequest;
import ru.ifmo.se.dto.responses.CoordinatesResponse;
import ru.ifmo.se.dto.responses.PageResponse;
import ru.ifmo.se.entities.Coordinates;
import ru.ifmo.se.exceptions.NotFoundException;
import ru.ifmo.se.mappers.CoordinatesMapper;
import ru.ifmo.se.repositories.api.CoordinatesRepository;
import ru.ifmo.se.services.api.CoordinatesService;

import java.util.List;

@ApplicationScoped
public class CoordinatesServiceImpl implements CoordinatesService {

    @Inject
    private CoordinatesRepository coordinatesRepository;

    @Inject
    private CoordinatesMapper coordinatesMapper;

    @Override
    public PageResponse<CoordinatesResponse> getCoordinates(Integer page, Integer size, String sortBy, Boolean ascending) {
        List<Coordinates> coordinatesList = coordinatesRepository.getCoordinates(page, size, sortBy, ascending);
        long total = coordinatesRepository.countAllEntities();
        return new PageResponse<>(coordinatesMapper.toResponseList(coordinatesList), page, size, total);
    }

    @Override
    public CoordinatesResponse getCoordinatesById(Long id) {

        Coordinates coordinates = coordinatesRepository.getCoordinatesById(id)
                .orElseThrow(() -> new NotFoundException("Coordinates with id " + id + " not found."));
        return coordinatesMapper.toResponse(coordinates);
    }

    @Override
    public CoordinatesResponse saveCoordinates(CoordinatesRequest request) {
        Coordinates coordinates = coordinatesMapper.fromRequest(request);
        return coordinatesMapper.toResponse(coordinatesRepository.saveCoordinates(coordinates));
    }

    @Override
    public CoordinatesResponse updateCoordinates(Long id, CoordinatesRequest request) {
        Coordinates coordinates = coordinatesMapper.fromRequest(request);
        coordinates.setId(id);
        return coordinatesMapper.toResponse(coordinatesRepository.updateCoordinates(coordinates));
    }

    @Override
    public void deleteCoordinatesById(Long id) {
        coordinatesRepository.deleteCoordinatesById(id);
    }
}
