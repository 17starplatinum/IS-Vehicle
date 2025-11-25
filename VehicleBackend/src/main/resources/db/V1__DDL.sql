CREATE TYPE vehicle_type AS ENUM (
    'PLANE', 
    'DRONE', 
    'SHIP', 
    'HOVERBOARD'
);

CREATE TYPE fuel_type AS ENUM (
    'GASOLINE', 
    'KEROSENE', 
    'ALCOHOL', 
    'NUCLEAR', 
    'ANTIMATTER'
);

CREATE TABLE coordinates (
    id SERIAL PRIMARY KEY,
    x BIGINT NOT NULL,
    y DOUBLE PRECISION NOT NULL
);

CREATE INDEX idx_coordinates_xy ON coordinates(x, y);

CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    coordinates_id INTEGER NOT NULL REFERENCES coordinates(id) ON DELETE CASCADE,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    vehicle_type vehicle_type NOT NULL,
    engine_power DOUBLE PRECISION CHECK (engine_power > 0),
    number_of_wheels INTEGER NOT NULL CHECK (number_of_wheels > 0),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    distance_travelled DOUBLE PRECISION NOT NULL CHECK (distance_travelled > 0),
    fuel_consumption BIGINT NOT NULL CHECK (fuel_consumption > 0),
    fuel_type fuel_type NOT NULL
);

CREATE INDEX idx_vehicles_fuel_type ON vehicles(fuel_type);
CREATE INDEX idx_vehicles_fuel_consumption ON vehicles(fuel_consumption);
CREATE INDEX idx_vehicles_engine_power ON vehicles(engine_power);
CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);
