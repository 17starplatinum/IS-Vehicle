package ru.ifmo.se.repositories.api;

import ru.ifmo.se.entities.Vehicle;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface VehicleRepository {
    List<Vehicle> getVehicles(int page, int size, String sortBy, boolean ascending, String fuelType, boolean enginePowerRangeEnabled, Double min, Double max, String filter);
    Optional<Vehicle> getVehicleById(long id);
    Vehicle saveVehicle(Vehicle vehicle);
    Vehicle updateVehicle(Vehicle vehicle);
    void deleteVehicleById(long id);
    long calculateFuelConsumptionSum();
    Map<Long, Long> groupVehiclesByFuelConsumption();
    void resetDistanceTravelled(Long id);
    long countAllEntities();
}
