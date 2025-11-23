package ru.ifmo.se.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.ifmo.se.dto.requests.CoordinatesRequest;
import ru.ifmo.se.dto.responses.CoordinatesResponse;
import ru.ifmo.se.dto.responses.PageResponse;
import ru.ifmo.se.entities.Coordinates;

import java.util.List;

@Mapper(componentModel = "cdi")
public interface CoordinatesMapper {
    CoordinatesResponse toDto(Coordinates coordinates);

    @Mapping(target = "id", ignore = true)
    Coordinates fromDto(CoordinatesRequest coordinatesRequest);

    List<CoordinatesResponse> toDtoList(List<Coordinates> coordinatesList);
    PageResponse<CoordinatesResponse> toDtoPage(List<CoordinatesResponse> coordinatesList, int page, int pageSize, long total);
}
