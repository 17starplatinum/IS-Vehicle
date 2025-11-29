import { 
    Vehicle as VehicleModel,
    Coordinates as CoordinatesModel,
    VehicleType as VehicleModelType,
    FuelType as VehicleFuelModelType
} from '../../../../core/models/vehicle.model';

export type VehicleType = VehicleModelType;
export type FuelType = VehicleFuelModelType;
export type Vehicle = VehicleModel;
export type Coordinates = CoordinatesModel;

export interface PageResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
}
export type CoordinatesRef = { id: number } | { x: number; y: number };

export interface CreateVehicleRequest {
  name: string;
  type: VehicleType;
  enginePower?: number | null;
  numberOfWheels: number;
  capacity: number;
  distanceTravelled: number;
  fuelConsumption: number;
  fuelType: FuelType;

  coordinates?: {
    id: number;
  } | CreateCoordinatesRequest;
}
export interface CreateCoordinatesRequest {
    x: number;
    y: number;
}

export type UpdateVehicleRequest = Partial<CreateVehicleRequest>;
export type UpdateCoordinatesRequest = Partial<CreateCoordinatesRequest>;

export type EventType = 'CREATED' | 'UPDATED' | 'DELETED';

export interface VehicleEvent {
  type: EventType;
  vehicle: Vehicle | { id: number };
}

export interface CoordinatesEvent {
  type: EventType;
  coordinates: Coordinates | { id: number };
}
