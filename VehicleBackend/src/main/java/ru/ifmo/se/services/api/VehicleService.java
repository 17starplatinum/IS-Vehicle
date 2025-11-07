package ru.ifmo.se.services.api;

import ru.ifmo.se.dto.requests.VehicleRequest;
import ru.ifmo.se.dto.responses.VehicleResponse;

import java.util.List;
import java.util.Map;

public interface VehicleService {
    List<VehicleResponse> getVehicles(Integer page, Integer size, String sortBy, Boolean ascending);
    VehicleResponse getVehicleById(Long id);
    VehicleResponse saveVehicle(VehicleRequest request);
    VehicleResponse updateVehicle(Long id, VehicleRequest request);
    void deleteVehicleById(Long id);
    long calculateFuelConsumptionSum();
    Map<Long, Long> groupVehiclesByFuelConsumption();
    List<VehicleResponse> findByFuelTypeLessThan(String fuelType);
    List<VehicleResponse> findByEnginePowerRange(Double min, Double max);
    void resetDistanceTravelled(Long id);
}
