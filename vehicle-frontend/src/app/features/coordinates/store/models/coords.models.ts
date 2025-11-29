import { 
    Coordinates as CoordinatesModel,
} from '../../../../core/models/vehicle.model';

export type Coordinates = CoordinatesModel;

export interface PageResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
}

export interface CreateCoordinatesRequest {
    x: number;
    y: number;
}

export type UpdateCoordinatesRequest = Partial<CreateCoordinatesRequest>;

export type EventType = 'CREATED' | 'UPDATED' | 'DELETED';

export interface CoordinatesEvent {
  type: EventType;
  coordinates: Coordinates | { id: number };
}
