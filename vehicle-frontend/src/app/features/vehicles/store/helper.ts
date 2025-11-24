import { Vehicle, VehicleType, FuelType } from '../../../core/models/vehicle.model';
import { CreateVehicleRequest, CoordinatesRef } from './models/vehicles.models';

export function buildCreateVehicleRequest(input: CreateVehicleRequest): CreateVehicleRequest {
  if (!input.name) throw new Error('name is required');
  if (!input.type) throw new Error('type is required');
  if (input.numberOfWheels == null) throw new Error('numberOfWheels is required');
  if (input.capacity == null) throw new Error('capacity is required');
  if (input.distanceTravelled == null) throw new Error('distanceTravelled is required');
  if (input.fuelConsumption == null) throw new Error('fuelConsumption is required');
  if (!input.fuelType) throw new Error('fuelType is required');

  let coords: CoordinatesRef | undefined;
  if (input.coordinates) {
    const c: any = input.coordinates;
    if (typeof c.id === 'number') {
      coords = { id: c.id };
    } else if (typeof c.x === 'number' && typeof c.y === 'number') {
      coords = { x: c.x, y: c.y };
    } else {
      throw new Error('coordinates must be {id} or {x,y}');
    }
  }

  const payload: CreateVehicleRequest = {
    name: input.name,
    coordinates: coords,
    type: input.type as VehicleType,
    enginePower: input.enginePower ?? null,
    numberOfWheels: input.numberOfWheels,
    capacity: input.capacity,
    distanceTravelled: input.distanceTravelled,
    fuelConsumption: input.fuelConsumption,
    fuelType: input.fuelType as FuelType
  };

  return payload;
}
