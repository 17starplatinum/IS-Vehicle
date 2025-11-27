DROP TYPE IF EXISTS vehicle_type;
DROP TYPE IF EXISTS fuel_type;

DROP INDEX IF EXISTS idx_coordinates_xy CASCADE;
DROP INDEX IF EXISTS idx_vehicles_fuel_type CASCADE;
DROP INDEX IF EXISTS idx_vehicles_fuel_consumption CASCADE;
DROP INDEX IF EXISTS idx_vehicles_engine_power CASCADE;
DROP INDEX IF EXISTS idx_vehicles_type CASCADE;

DROP TABLE IF EXISTS coordinates;
DROP TABLE IF EXISTS vehicles;

DROP FUNCTION IF EXISTS calculate_total_fuel_consumption();
DROP FUNCTION IF EXISTS group_by_fuel_consumption();
DROP FUNCTION IF EXISTS find_by_fuel_type_less_than(target_fuel_type text);
DROP FUNCTION IF EXISTS find_by_engine_power_range(range_min double precision, range_max double precision);
DROP FUNCTION IF EXISTS reset_distance_travelled(vehicle_id bigint);
