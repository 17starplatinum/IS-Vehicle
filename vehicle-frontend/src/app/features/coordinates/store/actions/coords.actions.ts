import { createAction, props } from '@ngrx/store';
import { Coordinates } from '../../../../core/models/vehicle.model';
import { CreateCoordinatesRequest, PageResponse } from '../models/coords.models';

export const loadCoordinatesList = createAction('[Coordinates] Load', props<{page:number,pageSize:number,sortBy:string,ascending:boolean}>());
export const loadCoordinatesListSuccess = createAction('[Coordinates] Load Success', props<{response: PageResponse<Coordinates>}>());
export const loadCoordinatesListFailure = createAction('[Coordinates] Load Failure', props<{error:any}>());

export const loadCoordinates = createAction('[Coordinates] Load (1)', props<{id: number}>());
export const loadCoordinatesSuccess = createAction('[Coordinates] Load (1) Success', props<{coordinates: Coordinates}>());
export const loadCoordinatesFailure = createAction('[Coordinates] Load (1) Failure', props<{error: any}>());

export const createCoordinates = createAction('[Coordinates] Create', props<{coordinates: CreateCoordinatesRequest}>());
export const createCoordinatesSuccess = createAction('[Coordinates] Create Success', props<{coordinates: Coordinates}>());
export const createCoordinatesFailure = createAction('[Coordinates] Create Failure', props<{error:any}>());

export const updateCoordinates = createAction('[Coordinates] Update', props<{id:number, changes: CreateCoordinatesRequest}>());
export const updateCoordinatesSuccess = createAction('[Coordinates] Update Success', props<{coordinates: Coordinates}>());
export const updateCoordinatesFailure = createAction('[Coordinates] Update Failure', props<{error:any}>());

export const deleteCoordinates = createAction('[Coordinates] Delete', props<{id:number}>());
export const deleteCoordinatesSuccess = createAction('[Coordinates] Delete Success', props<{id:number}>());
export const deleteCoordinatesFailure = createAction('[Coordinates] Delete Failure', props<{error:any}>());

export const coordinatesCreatedByServer = createAction('[Coordinates] Server Created', props<{coordinates: Coordinates}>());
export const coordinatesUpdatedByServer = createAction('[Coordinates] Server Updated', props<{coordinates: Coordinates}>());
export const coordinatesDeletedByServer = createAction('[Coordinates] Server Deleted', props<{id:number}>());
