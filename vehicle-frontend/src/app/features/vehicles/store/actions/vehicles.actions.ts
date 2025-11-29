import { createAction, props } from '@ngrx/store';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { CreateVehicleRequest, PageResponse } from '../models/vehicles.models';
  
export const loadVehicles = createAction('[Vehicles] Load', props<{page:number,pageSize:number,sortBy:string,ascending:boolean,fuelType:string|null,min:number|null,max:number|null,filter:string|null}>());
export const loadVehiclesSuccess = createAction('[Vehicles] Load Success', props<{response: PageResponse<Vehicle>}>());
export const loadVehiclesFailure = createAction('[Vehicles] Load Failure', props<{error:any}>());

export const loadVehicle = createAction('[Vehicles] Load (1)', props<{id: number}>());
export const loadVehicleSuccess = createAction('[Vehicles] Load (1) Success', props<{vehicle:Vehicle}>());
export const loadVehicleFailure = createAction('[Vehicles] Load (1) Failure', props<{error: any}>());

export const createVehicle = createAction('[Vehicles] Create', props<{vehicle: CreateVehicleRequest}>());
export const createVehicleSuccess = createAction('[Vehicles] Create Success', props<{vehicle:Vehicle}>());
export const createVehicleFailure = createAction('[Vehicles] Create Failure', props<{error:any}>());

export const updateVehicle = createAction('[Vehicles] Update', props<{id:number, changes: CreateVehicleRequest}>());
export const updateVehicleSuccess = createAction('[Vehicles] Update Success', props<{vehicle:Vehicle}>());
export const updateVehicleFailure = createAction('[Vehicles] Update Failure', props<{error:any}>());

export const deleteVehicle = createAction('[Vehicles] Delete', props<{id:number}>());
export const deleteVehicleSuccess = createAction('[Vehicles] Delete Success', props<{id:number}>());
export const deleteVehicleFailure = createAction('[Vehicles] Delete Failure', props<{error:any}>());

export const vehicleCreatedByServer = createAction('[Vehicles] Server Created', props<{vehicle:Vehicle}>());
export const vehicleUpdatedByServer = createAction('[Vehicles] Server Updated', props<{vehicle:Vehicle}>());
export const vehicleDeletedByServer = createAction('[Vehicles] Server Deleted', props<{id:number}>());
