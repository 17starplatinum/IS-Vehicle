package ru.ifmo.se.configs;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.annotation.PostConstruct;
import jakarta.inject.Inject;
import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;

@ApplicationScoped
public class DBMigration {
    private static final Logger logger = LoggerFactory.getLogger(DBMigration.class);

    @Inject
    private DataSource dataSource;

    @PostConstruct
    public void migrate() {
        logger.info("Starting database migration...");

        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .load();
        flyway.migrate();
        logger.info("Database migration finished. Current version is: {}.", flyway.info().current().getVersion());
    }
}
