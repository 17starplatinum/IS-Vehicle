package ru.ifmo.se.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ru.ifmo.se.dto.requests.CoordinatesRequest;
import ru.ifmo.se.dto.responses.CoordinatesResponse;
import ru.ifmo.se.entities.Coordinates;

import java.util.List;

@Mapper(componentModel = "cdi", config = BaseMapper.class)
public interface CoordinatesMapper {
    CoordinatesMapper INSTANCE = Mappers.getMapper(CoordinatesMapper.class);

    CoordinatesResponse toResponse(Coordinates coordinates);

    @Mapping(target = "id", ignore = true)
    Coordinates fromRequest(CoordinatesRequest coordinatesRequest);

    List<CoordinatesResponse> toResponseList(List<Coordinates> coordinatesList);
}
