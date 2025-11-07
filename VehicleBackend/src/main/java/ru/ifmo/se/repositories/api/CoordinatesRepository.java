package ru.ifmo.se.repositories.api;

import jakarta.ejb.Stateless;
import ru.ifmo.se.entities.Coordinates;

import java.util.List;
import java.util.Optional;

@Stateless
public interface CoordinatesRepository {
    List<Coordinates> getCoordinates(int page, int size, String sortBy, boolean ascending);
    Optional<Coordinates> getCoordinatesById(long id);
    Coordinates saveCoordinates(Coordinates coordinates);
    Coordinates updateCoordinates(Coordinates coordinates);
    void deleteCoordinatesById(long id);
}
