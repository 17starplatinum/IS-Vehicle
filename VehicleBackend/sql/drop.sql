DROP TYPE IF EXISTS vehicle_type;
DROP TYPE IF EXISTS fuel_type;

DROP INDEX IF EXISTS idx_coordinates_xy;
DROP INDEX IF EXISTS idx_vehicles_fuel_type;
DROP INDEX IF EXISTS idx_vehicles_fuel_consumption;
DROP INDEX IF EXISTS idx_vehicles_engine_power;
DROP INDEX IF EXISTS idx_vehicles_type;

DROP TABLE IF EXISTS coordinates;
DROP TABLE IF EXISTS vehicles;
