package ru.ifmo.se.repositories.api;

import ru.ifmo.se.dto.responses.DatabaseFunctionResult;
import ru.ifmo.se.entities.FuelType;
import ru.ifmo.se.entities.Vehicle;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface VehicleRepository {
    List<Vehicle> getVehicles(int page, int size, String sortBy, boolean ascending);
    Optional<Vehicle> getVehicleById(long id);
    Vehicle saveVehicle(Vehicle vehicle);
    Vehicle updateVehicle(Vehicle vehicle);
    void deleteVehicleById(long id);
    long calculateFuelConsumptionSum();
    Map<Long, Long> groupVehiclesByFuelConsumption();
    List<DatabaseFunctionResult> findByFuelTypeLessThan(FuelType fuelType);
    List<DatabaseFunctionResult> findByEnginePowerRange(Double min, Double max);
    void resetDistanceTravelled(Long id);
}
