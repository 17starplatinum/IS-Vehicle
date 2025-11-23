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
import ru.ifmo.se.validation.CoordinatesValidator;

import java.util.*;

@ApplicationScoped
public class CoordinatesServiceImpl implements CoordinatesService {

    @Inject
    private CoordinatesRepository coordinatesRepository;

    @Inject
    private CoordinatesMapper coordinatesMapper;

    @Inject
    private CoordinatesValidator coordinatesValidator;

    @Override
    public PageResponse<CoordinatesResponse> getCoordinates(Integer page, Integer size, String sortBy, Boolean ascending) {
        ascending = coordinatesValidator.validateGetParameters(page, size, ascending);
        if (!coordinatesValidator.isValidSortField(sortBy)) {
            throw new IllegalArgumentException("Sorting field is not valid. Must be one of: id, x, y");
        }
        List<Coordinates> coordinatesList = coordinatesRepository.getCoordinates(page, size, sortBy, ascending);
        long total = coordinatesRepository.countAllEntities();
        return coordinatesMapper.toDtoPage(coordinatesMapper.toDtoList(coordinatesList), page, size, total);
    }

    @Override
    public CoordinatesResponse getCoordinatesById(Long id) {
        coordinatesValidator.validateId(id);
        Coordinates coordinates = coordinatesRepository.getCoordinatesById(id)
                .orElseThrow(() -> new NotFoundException("Coordinates with id " + id + " not found."));
        return coordinatesMapper.toDto(coordinates);
    }

    @Override
    public CoordinatesResponse saveCoordinates(CoordinatesRequest request) {
        coordinatesValidator.validateRequest(request);
        Coordinates coordinates = coordinatesMapper.fromDto(request);
        return coordinatesMapper.toDto(coordinatesRepository.saveCoordinates(coordinates));
    }

    @Override
    public CoordinatesResponse updateCoordinates(Long id, CoordinatesRequest request) {
        coordinatesValidator.validateId(id);
        coordinatesValidator.validateRequest(request);
        Coordinates coordinates = coordinatesMapper.fromDto(request);
        coordinates.setId(id);
        return coordinatesMapper.toDto(coordinatesRepository.updateCoordinates(coordinates));
    }

    @Override
    public void deleteCoordinatesById(Long id) {
        coordinatesValidator.validateId(id);
        coordinatesRepository.deleteCoordinatesById(id);
    }
}
