export interface Coordinates {
    id: number;
    x: number;
    y: number;
}

export type VehicleType = 'PLANE' | 'DRONE' | 'SHIP' | 'HOVERBOARD';
export type FuelType = 'GASOLINE' | 'KEROSENE' | 'ALCOHOL' | 'NUCLEAR' | 'ANTIMATTER';

export interface Vehicle {
    id: number;
    name: string;
    coordinates: Coordinates;
    creationDate: string;
    type: VehicleType;
    enginePower?: number | null;
    numberOfWheels: number;
    capacity: number;
    distanceTravelled: number;
    fuelConsumption: number;
    fuelType: FuelType;
}
