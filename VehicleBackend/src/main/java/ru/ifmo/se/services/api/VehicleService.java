package ru.ifmo.se.services.api;

import ru.ifmo.se.dto.requests.VehicleRequest;
import ru.ifmo.se.dto.responses.PageResponse;
import ru.ifmo.se.dto.responses.VehicleResponse;

import java.util.Map;

public interface VehicleService {
    PageResponse<VehicleResponse> getVehicles(Integer page, Integer size, String sortBy, Boolean ascending, String fuelType, Boolean enginePowerRange, Double min, Double max, String filter);
    VehicleResponse getVehicleById(Long id);
    VehicleResponse saveVehicle(VehicleRequest request);
    VehicleResponse updateVehicle(Long id, VehicleRequest request);
    void deleteVehicleById(Long id);
    long calculateFuelConsumptionSum();
    Map<Long, Long> groupVehiclesByFuelConsumption();
    void resetDistanceTravelled(Long id);
}
