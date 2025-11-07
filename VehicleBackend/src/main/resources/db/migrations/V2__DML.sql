CREATE OR REPLACE FUNCTION calculate_total_fuel_consumption()
RETURNS BIGINT AS $$
BEGIN
    RETURN COALESCE((SELECT SUM(fuel_consumption) FROM vehicles), 0);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION group_by_fuel_consumption()
    RETURNS TABLE(
        fuel_consumption BIGINT, count BIGINT
                 ) AS $$
BEGIN
    RETURN QUERY
        SELECT v.fuel_consumption, COUNT(*)::BIGINT AS count
        FROM vehicles v
        GROUP BY v.fuel_consumption
        ORDER BY v.fuel_consumption;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION find_by_fuel_type_less_than(target_fuel_type TEXT)
    RETURNS TABLE(
                     id BIGINT,
                     name TEXT,
                     creation_date TIMESTAMP,
                     coordinates_id BIGINT,
                     coordinates_x BIGINT,
                     coordinates_y DOUBLE PRECISION,
                     vehicle_type TEXT,
                     engine_power DOUBLE PRECISION,
                     number_of_wheels INTEGER,
                     capacity INTEGER,
                     distance_travelled DOUBLE PRECISION,
                     fuel_consumption BIGINT,
                     fuel_type TEXT
                 ) AS $$
BEGIN
    RETURN QUERY
        SELECT
            v.id,
            v.name,
            v.creation_date,
            c.id AS coordinates_id,
            c.x AS coordinates_x,
            c.y AS coordinates_y,
            v.type::TEXT AS vehicle_type,
            v.engine_power,
            v.number_of_wheels,
            v.capacity,
            v.distance_travelled,
            v.fuel_consumption,
            v.fuel_type::TEXT
        FROM vehicles v
                 JOIN coordinates c ON v.coordinates_id = c.id
        WHERE v.fuel_type::TEXT < LOWER(target_fuel_type)
        ORDER BY v.fuel_type, v.name;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION find_by_engine_power_range(
    range_min DOUBLE PRECISION,
    range_max DOUBLE PRECISION
)
    RETURNS TABLE(
                     id BIGINT,
                     name TEXT,
                     creation_date TIMESTAMP,
                     coordinates_id BIGINT,
                     coordinates_x BIGINT,
                     coordinates_y DOUBLE PRECISION,
                     vehicle_type TEXT,
                     engine_power DOUBLE PRECISION,
                     number_of_wheels INTEGER,
                     capacity INTEGER,
                     distance_travelled DOUBLE PRECISION,
                     fuel_consumption BIGINT,
                     fuel_type TEXT
                 ) AS $$
BEGIN
    IF range_min IS NULL OR range_max IS NULL THEN
        RAISE EXCEPTION 'Range boundaries cannot be null';
    END IF;
    IF range_min > range_max THEN
        RAISE EXCEPTION 'Min range value cannot be greater than max range value';
    END IF;

    RETURN QUERY
        SELECT
            v.id,
            v.name,
            v.creation_date,
            c.id AS coordinates_id,
            c.x AS coordinates_x,
            c.y AS coordinates_y,
            v.type::TEXT AS vehicle_type,
            v.engine_power,
            v.number_of_wheels,
            v.capacity,
            v.distance_travelled,
            v.fuel_consumption,
            v.fuel_type::TEXT
        FROM vehicles v
                 JOIN coordinates c ON v.coordinates_id = c.id
        WHERE
            v.engine_power IS NOT NULL AND
            v.engine_power >= range_min AND
            v.engine_power <= range_max
        ORDER BY v.engine_power ASC, v.name ASC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION reset_distance_travelled(vehicle_id BIGINT)
    RETURNS TABLE(
                     success BOOLEAN,
                     old_distance DOUBLE PRECISION,
                     new_distance DOUBLE PRECISION
                 ) AS $$
DECLARE
    old_value DOUBLE PRECISION;
BEGIN
    SELECT distance_travelled INTO old_value
    FROM vehicles
    WHERE id = vehicle_id
        FOR UPDATE;

    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::DOUBLE PRECISION, NULL::DOUBLE PRECISION;
        RETURN;
    END IF;

    UPDATE vehicles
    SET distance_travelled = 0.0
    WHERE id = vehicle_id;

    RETURN QUERY
        SELECT true,
               old_value,
               0.0::DOUBLE PRECISION;
END;
$$ LANGUAGE plpgsql;
