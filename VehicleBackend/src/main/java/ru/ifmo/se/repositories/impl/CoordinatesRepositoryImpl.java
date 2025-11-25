package ru.ifmo.se.repositories.impl;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.ifmo.se.entities.Coordinates;
import ru.ifmo.se.exceptions.NotFoundException;
import ru.ifmo.se.repositories.api.CoordinatesRepository;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class CoordinatesRepositoryImpl implements CoordinatesRepository {

    private static final Logger log = LoggerFactory.getLogger(CoordinatesRepositoryImpl.class);

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Coordinates> getCoordinates(int page, int size, String sortBy, boolean ascending) {
        log.debug("Getting coordinates. Load parameters: page = {}, page size = {}, sorting field = {}, order = {}", page, size, sortBy, ascending ? "ascending" : "descending");
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Coordinates> cq = builder.createQuery(Coordinates.class);
        Root<Coordinates> root = cq.from(Coordinates.class);

        if (ascending) {
            cq.orderBy(builder.asc(root.get(sortBy)));
        } else {
            cq.orderBy(builder.desc(root.get(sortBy)));
        }

        TypedQuery<Coordinates> query = em.createQuery(cq);

        query.setFirstResult((page - 1) * size);
        query.setMaxResults(size);

        log.debug("Returning coordinates: {}", query.getResultList());
        return query.getResultList();
    }

    @Override
    public Optional<Coordinates> getCoordinatesById(long id) {
        log.debug("Getting coordinates with id: {}", id);
        return Optional.ofNullable(em.find(Coordinates.class, id));
    }

    @Override
    @Transactional
    public Coordinates saveCoordinates(Coordinates coordinates) {
        log.debug("Saving coordinates: {}", coordinates.toString());
        if (coordinates.getId() == null) {
            em.persist(coordinates);
            log.debug("Saved coordinates (persisted): {}", coordinates);
            return coordinates;
        }
        log.debug("Saved coordinates (merged): {}", coordinates);
        return em.merge(coordinates);
    }

    @Override
    @Transactional
    public Coordinates updateCoordinates(Coordinates coordinates) {
        log.debug("Preparing to update coordinates...");
        Coordinates existingCoordinates = em.find(Coordinates.class, coordinates.getId());
        if (existingCoordinates == null) {
            log.error("No coordinates found with id: {}", coordinates.getId());
            throw new EntityNotFoundException("No coordinates found with id: " + coordinates.getId());
        }
        existingCoordinates.setX(coordinates.getX());
        existingCoordinates.setY(coordinates.getY());
        log.debug("Updating coordinates with id = {} to {}", coordinates.getId(), existingCoordinates);
        return em.merge(existingCoordinates);
    }

    @Override
    public void deleteCoordinatesById(long id) {
        log.debug("Deleting coordinates with id: {}", id);
        Optional<Coordinates> coordinates = getCoordinatesById(id);
        if (coordinates.isEmpty()) {
            throw new NotFoundException("No coordinates found with id: " + id);
        }
        em.remove(coordinates.get());
    }

    @Override
    public long countAllEntities() {
        String jpql = "SELECT COUNT(e) FROM Coordinates e";
        TypedQuery<Long> query = em.createQuery(jpql, Long.class);
        return query.getSingleResult();
    }
}
