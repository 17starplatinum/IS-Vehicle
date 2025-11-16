package ru.ifmo.se.repositories.api;

import ru.ifmo.se.entities.Coordinates;

import java.util.List;
import java.util.Optional;

public interface CoordinatesRepository {
    List<Coordinates> getCoordinates(int page, int size, String sortBy, boolean ascending);
    Optional<Coordinates> getCoordinatesById(long id);
    Coordinates saveCoordinates(Coordinates coordinates);
    Coordinates updateCoordinates(Coordinates coordinates);
    void deleteCoordinatesById(long id);
}
