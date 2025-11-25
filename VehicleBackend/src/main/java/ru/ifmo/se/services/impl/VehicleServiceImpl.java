package ru.ifmo.se.services.impl;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import ru.ifmo.se.dto.requests.VehicleRequest;
import ru.ifmo.se.dto.responses.DatabaseFunctionResult;
import ru.ifmo.se.dto.responses.PageResponse;
import ru.ifmo.se.dto.responses.VehicleResponse;
import ru.ifmo.se.entities.FuelType;
import ru.ifmo.se.entities.Vehicle;
import ru.ifmo.se.exceptions.NotFoundException;
import ru.ifmo.se.mappers.VehicleMapper;
import ru.ifmo.se.repositories.api.VehicleRepository;
import ru.ifmo.se.services.api.VehicleService;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@ApplicationScoped
public class VehicleServiceImpl implements VehicleService {

    @Inject
    private VehicleRepository vehicleRepository;
    
    @Inject
    private VehicleMapper vehicleMapper;

    @Override
    public PageResponse<VehicleResponse> getVehicles(Integer page, Integer size, String sortBy, Boolean ascending) {
        List<Vehicle> vehicleList = vehicleRepository.getVehicles(page, size, sortBy, ascending);
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
    public VehicleResponse saveVehicle(VehicleRequest request) {
        return vehicleMapper.toResponse(vehicleRepository.saveVehicle(vehicleMapper.fromRequest(request)));
    }

    @Override
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleMapper.fromRequest(request);
        vehicle.setId(id);
        return vehicleMapper.toResponse(vehicleRepository.updateVehicle(vehicle));
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
    public List<VehicleResponse> findByFuelTypeLessThan(String fuelType) {
        List<DatabaseFunctionResult> results = vehicleRepository.findByFuelTypeLessThan(FuelType.fromValue(fuelType));

        return results.stream()
                .map(vehicleMapper::toResponseFromFunctionResult)
                .filter(Objects::nonNull)
                .toList();
    }

    @Override
    public List<VehicleResponse> findByEnginePowerRange(Double min, Double max) {
        List<DatabaseFunctionResult> results = vehicleRepository.findByEnginePowerRange(min, max);
        return results.stream()
                .map(vehicleMapper::toResponseFromFunctionResult)
                .filter(Objects::nonNull)
                .toList();
    }

    @Override
    public void resetDistanceTravelled(Long id) {
        vehicleRepository.resetDistanceTravelled(id);
    }
}
