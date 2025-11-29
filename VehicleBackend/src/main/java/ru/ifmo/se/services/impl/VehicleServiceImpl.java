package ru.ifmo.se.services.impl;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import ru.ifmo.se.dto.requests.CoordinatesRequest;
import ru.ifmo.se.dto.requests.VehicleRequest;
import ru.ifmo.se.dto.responses.PageResponse;
import ru.ifmo.se.dto.responses.VehicleResponse;
import ru.ifmo.se.entities.Coordinates;
import ru.ifmo.se.entities.Vehicle;
import ru.ifmo.se.exceptions.NotFoundException;
import ru.ifmo.se.mappers.CoordinatesMapper;
import ru.ifmo.se.mappers.VehicleMapper;
import ru.ifmo.se.repositories.api.CoordinatesRepository;
import ru.ifmo.se.repositories.api.VehicleRepository;
import ru.ifmo.se.services.api.VehicleService;

import java.util.List;
import java.util.Map;

@ApplicationScoped
public class VehicleServiceImpl implements VehicleService {

    @Inject
    private VehicleRepository vehicleRepository;
    
    @Inject
    private VehicleMapper vehicleMapper;

    @Inject
    private CoordinatesRepository coordinatesRepository;

    @Inject
    private CoordinatesMapper coordinatesMapper;

    @Override
    public PageResponse<VehicleResponse> getVehicles(Integer page, Integer size, String sortBy, Boolean ascending, String fuelType, Boolean enginePowerRange, Double min, Double max, String filter) {
        List<Vehicle> vehicleList = vehicleRepository.getVehicles(page, size, sortBy, ascending, fuelType, enginePowerRange, min, max, filter);
        long total = vehicleRepository.countAllEntities();
        return new PageResponse<>(vehicleMapper.toResponseList(vehicleList), page, size, total);
    }

    @Override
    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.getVehicleById(id)
                .orElseThrow(() -> new NotFoundException("Vehicle with id " + id + " not found."));
        return vehicleMapper.toResponse(vehicle);
    }

    @Override
    @Transactional(Transactional.TxType.REQUIRED)
    public VehicleResponse saveVehicle(VehicleRequest request) {
        Coordinates coordinates;
        if (request.getCoordinates().getId() == null) {
            coordinates = coordinatesRepository.saveCoordinates(
                    coordinatesMapper.fromRequest(request.getCoordinates())
            );
        } else {
            coordinates = coordinatesRepository.getCoordinatesById(request.getCoordinates().getId())
                    .orElseThrow(() -> new NotFoundException("Coordinates with id " + request.getCoordinates().getId() + " not found"));
        }
        Vehicle vehicle = vehicleMapper.fromRequest(request);
        vehicle.setCoordinates(coordinates);
        Vehicle savedVehicle = vehicleRepository.saveVehicle(vehicle);
        return vehicleMapper.toResponse(savedVehicle);
    }

    @Override
    @Transactional(Transactional.TxType.REQUIRED)
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        vehicleRepository.getVehicleById(id).orElseThrow(() -> new NotFoundException("Vehicle with id " + id + " not found."));
        CoordinatesRequest coordinatesRequest = request.getCoordinates();
        Long coordinatesId = coordinatesRequest.getId();
        if (coordinatesId == null) {
            Coordinates coordinates = coordinatesRepository.saveCoordinates(coordinatesMapper.fromRequest(coordinatesRequest));
            Vehicle updatedVehicle = vehicleMapper.toEntity(request, coordinates);
            updatedVehicle = vehicleRepository.updateVehicle(updatedVehicle);
            return vehicleMapper.toResponse(updatedVehicle);
        }
        Coordinates coordinates = coordinatesRepository.getCoordinatesById(coordinatesId)
                        .orElseThrow(() -> new NotFoundException("Coordinates with id " + coordinatesId + "not found"));
        Vehicle updatedVehicle = vehicleMapper.toEntity(request, coordinates);
        updatedVehicle = vehicleRepository.updateVehicle(updatedVehicle);
        return vehicleMapper.toResponse(updatedVehicle);
    }

    @Override
    public void deleteVehicleById(Long id) {
        vehicleRepository.deleteVehicleById(id);
    }

    @Override
    public long calculateFuelConsumptionSum() {
        return vehicleRepository.calculateFuelConsumptionSum();
    }

    @Override
    public Map<Long, Long> groupVehiclesByFuelConsumption() {
        return vehicleRepository.groupVehiclesByFuelConsumption();
    }

    @Override
    public void resetDistanceTravelled(Long id) {
        vehicleRepository.resetDistanceTravelled(id);
    }
}
