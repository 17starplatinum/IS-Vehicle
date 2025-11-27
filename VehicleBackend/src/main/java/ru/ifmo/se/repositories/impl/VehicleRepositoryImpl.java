package ru.ifmo.se.repositories.impl;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.ifmo.se.entities.FuelType;
import ru.ifmo.se.entities.Vehicle;
import ru.ifmo.se.exceptions.NotFoundException;
import ru.ifmo.se.exceptions.SpecialFunctionException;
import ru.ifmo.se.repositories.api.VehicleRepository;

import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
public class VehicleRepositoryImpl implements VehicleRepository {

    private static final Logger log = LoggerFactory.getLogger(VehicleRepositoryImpl.class);

    @PersistenceContext(unitName = "vehiclePU")
    private EntityManager em;

    @Override
    public List<Vehicle> getVehicles(int page,
                                     int size,
                                     String sortBy,
                                     boolean ascending,
                                     String fuelType,
                                     boolean enginePowerRangeEnabled,
                                     Double min, Double max, String filter) {
        log.debug("Getting vehicles. Load parameters: page = {}, page size = {}, sorting field = {}, order = {}", page, size, sortBy, ascending ? "ascending" : "descending");
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Vehicle> cq = builder.createQuery(Vehicle.class);
        Root<Vehicle> root = cq.from(Vehicle.class);
        if (fuelType != null) {
            Query query = em.createNativeQuery(
                    "SELECT v.id FROM vehicles v WHERE v.id IN " +
                            "(SELECT id FROM find_by_fuel_type_less_than(:fuelType))", Long.class);
            query.setParameter("fuelType", FuelType.fromValue(fuelType));
            List<?> ids = query.getResultList();
            log.debug("Found {} vehicles with fuel type less than: {}", ids.size(), fuelType);
            if (ids.isEmpty()) {
                return Collections.emptyList();
            }
            Predicate fuelTypePredicate = root.get("id").in(ids);

            if (cq.getRestriction() != null) {
                cq.where(builder.and(cq.getRestriction(), fuelTypePredicate));
            } else {
                cq.where(fuelTypePredicate);
            }
        }
        if (enginePowerRangeEnabled) {
            String idsSql = "SELECT v.id FROM find_by_engine_power_range(:min, :max) f JOIN vehicles v ON v.id = f.id";
            Query idsQuery = em.createNativeQuery(idsSql)
                    .setParameter("min", min)
                    .setParameter("max", max);
            List<?> ids = idsQuery.getResultList();
            log.debug("Found {} vehicles in engine power range [{}, {}]", ids.size(), min, max);
            if (ids.isEmpty()) {
                return Collections.emptyList();
            }
            Predicate rangePredicate = root.get("id").in(ids);

            if (cq.getRestriction() != null) {
                cq.where(builder.and(cq.getRestriction(), rangePredicate));
            } else {
                cq.where(rangePredicate);
            }
        }
        List<String> stringFields = Arrays.asList("name", "type", "fuelType");
        if (filter != null && !filter.trim().isEmpty()) {
            String pattern = "%" + filter.trim().toLowerCase() + "%";
            List<Predicate> predicates = new ArrayList<>();

            for (String field : stringFields) {
                predicates.add(builder.like(
                        builder.lower(root.get(field)),
                        pattern
                ));
            }
            Predicate globalPredicate = builder.or(predicates.toArray(new Predicate[0]));
            if (cq.getRestriction() != null) {
                cq.where(builder.and(cq.getRestriction(), globalPredicate));
            } else {
                cq.where(globalPredicate);
            }
        }
        if (ascending) {
            cq.orderBy(builder.asc(root));
        } else {
            cq.orderBy(builder.desc(root));
        }
        TypedQuery<Vehicle> query = em.createQuery(cq);
        query.setFirstResult((page - 1) * size).setMaxResults(size);
        log.debug("Returning vehicles: {}", query.getResultList());
        return query.getResultList();
    }

    @Override
    public Optional<Vehicle> getVehicleById(long id) {
        log.debug("Getting vehicle with id: {}", id);
        return Optional.ofNullable(em.find(Vehicle.class, id));
    }

    @Override
    public Vehicle saveVehicle(Vehicle vehicle) {
        log.debug("Saving vehicle: {}", vehicle);
        if (vehicle.getCoordinates().getId() == null) {
            log.debug("New coordinates persisted");
        } else {
            log.debug("Existing coordinates merged with ID: {}", vehicle.getCoordinates().getId());
        }
        em.persist(vehicle);
        em.flush();
        return vehicle;
    }

    @Override
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
    @Transactional
    public void deleteVehicleById(long id) {
        log.debug("Deleting vehicle with id: {}...", id);
        Optional<Vehicle> vehicle = getVehicleById(id);
        if (vehicle.isEmpty()) {
            throw new NotFoundException("No vehicle found with id: " + id);
        }
        em.remove(vehicle.get());
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
    public void resetDistanceTravelled(Long id) {
        try {
            log.debug("Resetting distance travelled by fuel type for vehicle with id: {}...", id);
            Query query = em.createNativeQuery("SELECT * FROM reset_distance_travelled(:id)", Tuple.class);
            query.setParameter("id", id);
            Tuple result = (Tuple) query.getSingleResult();
            boolean isSuccessful = result.get(0, Boolean.class);
            if (!isSuccessful) {
                throw new NotFoundException("Vehicle not found to be reset");
            }
            log.debug("Distance travelled for vehicle with id: {} has been reset", id);
        } catch (Exception e) {
            throw new NotFoundException("Vehicle not found to be reset");
        }
    }
}
