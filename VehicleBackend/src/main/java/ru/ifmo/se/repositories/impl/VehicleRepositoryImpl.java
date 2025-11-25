package ru.ifmo.se.repositories.impl;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.ifmo.se.dto.responses.DatabaseFunctionResult;
import ru.ifmo.se.entities.FuelType;
import ru.ifmo.se.entities.Vehicle;
import ru.ifmo.se.exceptions.SpecialFunctionException;
import ru.ifmo.se.repositories.api.VehicleRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class VehicleRepositoryImpl implements VehicleRepository {

    private static final Logger log = LoggerFactory.getLogger(VehicleRepositoryImpl.class);
    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Vehicle> getVehicles(int page, int size, String sortBy, boolean ascending) {
        log.debug("Getting vehicles. Load parameters: page = {}, page size = {}, sorting field = {}, order = {}", page, size, sortBy, ascending ? "ascending" : "descending");
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Vehicle> cq = builder.createQuery(Vehicle.class);
        Root<Vehicle> root = cq.from(Vehicle.class);

        if (ascending) {
            cq.orderBy(builder.asc(root));
        } else {
            cq.orderBy(builder.desc(root));
        }

        TypedQuery<Vehicle> query = em.createQuery(cq);

        query.setFirstResult((page - 1) * size).setMaxResults(size);
        query.setMaxResults(size);
        log.debug("Returning vehicles: {}", query.getResultList());

        return query.getResultList();
    }

    @Override
    public Optional<Vehicle> getVehicleById(long id) {
        log.debug("Getting vehicle with id: {}", id);
        return Optional.ofNullable(em.find(Vehicle.class, id));
    }

    @Override
    @Transactional
    public Vehicle saveVehicle(Vehicle vehicle) {
        log.debug("Saving vehicle: {}", vehicle);
        if (vehicle.getId() == null) {
            em.persist(vehicle);
            log.debug("Saved vehicle (persisted): {}", vehicle);
            return vehicle;
        }
        log.debug("Saved vehicle (merged): {}", vehicle);
        return em.merge(vehicle);
    }

    @Override
    @Transactional
    public Vehicle updateVehicle(Vehicle vehicle) {
        log.debug("Preparing to update vehicle...");
        Vehicle existingVehicle = em.find(Vehicle.class, vehicle.getId());
        if (existingVehicle == null) {
            log.error("No vehicle found with id: {}", vehicle.getId());
            throw new EntityNotFoundException("No vehicle found with id: " + vehicle.getId());
        }
        existingVehicle.setName(vehicle.getName());
        existingVehicle.setCoordinates(vehicle.getCoordinates());
        existingVehicle.setType(vehicle.getType());
        existingVehicle.setEnginePower(vehicle.getEnginePower());
        existingVehicle.setNumberOfWheels(vehicle.getNumberOfWheels());
        existingVehicle.setCapacity(vehicle.getCapacity());
        existingVehicle.setDistanceTravelled(vehicle.getDistanceTravelled());
        existingVehicle.setFuelConsumption(vehicle.getFuelConsumption());
        existingVehicle.setFuelType(vehicle.getFuelType());

        log.debug("Updating vehicle with id = {} to {}...", vehicle.getId(), existingVehicle);
        return em.merge(existingVehicle);
    }

    @Override
    public void deleteVehicleById(long id) {
        log.debug("Deleting vehicle with id: {}...", id);
        getVehicleById(id).ifPresent(em::remove);
    }

    @Override
    public long countAllEntities() {
        String jpql = "SELECT COUNT(e) FROM Vehicle e";
        TypedQuery<Long> query = em.createQuery(jpql, Long.class);
        return query.getSingleResult();
    }

    @Override
    public long calculateFuelConsumptionSum() {
        try {
            log.debug("Calculating fuel consumption sum...");
            Query query = em.createNativeQuery("SELECT calculate_total_fuel_consumption()");
            Object result = query.getSingleResult();
            log.debug("Calculated fuel consumption sum: {}", result);
            return (long) result;
        } catch (Exception e) {
            log.error("Error calling fuel consumption sum: {}", e.getMessage());
            throw new SpecialFunctionException("Error calling vehicle fuel consumption sum: ", e);
        }
    }

    @Override
    public Map<Long, Long> groupVehiclesByFuelConsumption() {
        try {
            log.debug("Grouping vehicles by fuel consumption...");
            Query query = em.createNativeQuery(
                    "SELECT fuel_consumption, count FROM group_by_fuel_consumption()"
            );

            // это вызывает великую досаду...
            @SuppressWarnings("unchecked")
            List<Object[]> results = query.getResultList();
            log.debug("Grouped {} vehicles by fuel consumption", results.size());
            return results.stream()
                    .collect(Collectors.toMap(
                            row -> (long) row[0],
                            row -> (long) row[1]
                    ));
        } catch (Exception e) {
            log.error("Error calling vehicle grouping by fuel consumption: {}", e.getMessage());
            throw new SpecialFunctionException("Error calling grouping vehicles by fuel consumption: ", e);
        }
    }

    @Override
    public List<DatabaseFunctionResult> findByFuelTypeLessThan(FuelType fuelType) {
        try {
            log.debug("Finding vehicles by fuel type less than: {}", fuelType);
            Query query = em.createNativeQuery(
                    "SELECT v.* FROM vehicles v WHERE v.id IN " +
                       "(SELECT id FROM find_by_fuel_type_less_than(:fuelType))", Vehicle.class);
            query.setParameter("fuelType", fuelType.name());
            List<?> results = query.getResultList();
            log.debug("Found {} vehicles with fuel type less than: {}", results.size(), fuelType);
            return castToTypeSafeList(results);
        } catch (Exception e) {
            log.error("Error calling vehicle find by fuel type less than: {}", e.getMessage());
            throw new SpecialFunctionException("Error calling find vehicles by fuel type less than: ", e);
        }
    }

    @Override
    public List<DatabaseFunctionResult> findByEnginePowerRange(Double min, Double max) {
        try {
            log.debug("Finding vehicles inside engine power range: [{}]", min + "; " + max);
            Query query = em.createNativeQuery("SELECT v.* FROM vehicles v WHERE v.id IN " +
                                            "(SELECT id FROM find_by_engine_power_range(:min, :max))", Vehicle.class);
            query.setParameter("min", min);
            query.setParameter("max", max);
            List<?> results = query.getResultList();
            log.debug("Found {} vehicles inside engine power range: [{}]", results.size(), min + ", " + max);
            return castToTypeSafeList(results);
        } catch (Exception e) {
            log.error("Error calling vehicle find by engine power range: {}", e.getMessage());
            throw new SpecialFunctionException("Error calling find vehicles by engine power range: ", e);
        }
    }

    @Override
    public void resetDistanceTravelled(Long id) {
        try {
            log.debug("Resetting distance travelled by fuel type for vehicle with id: {}...", id);
            Query query = em.createNativeQuery("SELECT * FROM reset_distance_travelled(:id)", Tuple.class);
            query.setParameter("id", id);
            Tuple result = (Tuple) query.getSingleResult();
            boolean isSuccessful = result.get(0, Boolean.class);
            if (!isSuccessful) {
                throw new EntityNotFoundException("Vehicle not found to be reset");
            }
            log.debug("Distance travelled for vehicle with id: {} has been reset", id);
        } catch (Exception e) {
            throw new EntityNotFoundException("Vehicle not found to be reset");
        }
    }

    // Попытка убить warning про unchecked cast
    private List<DatabaseFunctionResult> castToTypeSafeList(List<?> list) {
        return list.stream()
                .map(result -> {
                    if (result instanceof Object[]) {
                        return new DatabaseFunctionResult((Object[]) result);
                    }
                    throw new IllegalStateException(
                            "Unexpected result type: " + (result != null ? result.getClass() : "null")
                    );
                })
                .collect(Collectors.toList());
    }
}
