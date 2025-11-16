package ru.ifmo.se.services.impl;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import ru.ifmo.se.dto.requests.VehicleRequest;
import ru.ifmo.se.dto.responses.DatabaseFunctionResult;
import ru.ifmo.se.dto.responses.VehicleResponse;
import ru.ifmo.se.entities.FuelType;
import ru.ifmo.se.entities.Vehicle;
import ru.ifmo.se.exceptions.CustomValidationException;
import ru.ifmo.se.exceptions.NotFoundException;
import ru.ifmo.se.mappers.VehicleMapper;
import ru.ifmo.se.repositories.api.VehicleRepository;
import ru.ifmo.se.services.api.VehicleService;
import ru.ifmo.se.validation.VehicleValidator;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@ApplicationScoped
public class VehicleServiceImpl implements VehicleService {

    @Inject
    private VehicleRepository vehicleRepository;
    
    @Inject
    private VehicleMapper vehicleMapper;

    @Inject
    private VehicleValidator vehicleValidator;


    @Override
    public List<VehicleResponse> getVehicles(Integer page, Integer size, String sortBy, Boolean ascending) {
        ascending = vehicleValidator.validateGetParameters(page, size, ascending);
        if (vehicleValidator.isValidSortField(sortBy)) {
            throw new IllegalArgumentException("Sorting field is not valid. Must be one of: id, x, y");
        }
        List<Vehicle> vehicleList = vehicleRepository.getVehicles(page, size, sortBy, ascending);
        return vehicleMapper.toDtoList(vehicleList);
    }

    @Override
    public VehicleResponse getVehicleById(Long id) {
        vehicleValidator.validateId(id);
        Vehicle vehicle = vehicleRepository.getVehicleById(id)
                .orElseThrow(() -> new NotFoundException("Vehicle with id " + id + " not found."));
        return vehicleMapper.toDto(vehicle);
    }

    @Override
    public VehicleResponse saveVehicle(VehicleRequest request) {
        vehicleValidator.validateRequest(request);
        return vehicleMapper.toDto(vehicleRepository.saveVehicle(vehicleMapper.fromDto(request)));
    }

    @Override
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        vehicleValidator.validateId(id);
        vehicleValidator.validateRequest(request);
        Vehicle vehicle = vehicleMapper.fromDto(request);
        vehicle.setId(id);
        return vehicleMapper.toDto(vehicleRepository.updateVehicle(vehicle));
    }

    @Override
    public void deleteVehicleById(Long id) {
        vehicleValidator.validateId(id);
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
        try {
            List<DatabaseFunctionResult> results = vehicleRepository.findByFuelTypeLessThan(FuelType.fromValue(fuelType));

            return results.stream()
                    .map(vehicleMapper::toResponseFromFunctionResult)
                    .filter(Objects::nonNull)
                    .toList();
        } catch (IllegalArgumentException e) {
            throw new CustomValidationException(e.getMessage());
        }
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
        vehicleValidator.validateId(id);
        vehicleRepository.resetDistanceTravelled(id);
    }
}
