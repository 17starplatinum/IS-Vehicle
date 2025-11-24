import { createFeature, createReducer, on } from '@ngrx/store';
import { Vehicle } from '../models/vehicles.models';
import * as VehiclesActions from '../actions/vehicles.actions';

export interface VehiclesState {
  list: Vehicle[];
  sortBy: string,
  page: number;
  pageSize: number;
  ascending: boolean;
  total: number;
  loading: boolean;
  error: any;
}

export const initialState: VehiclesState = {
  list: [],
  sortBy: 'id',
  page: 1,
  pageSize: 10,
  ascending: true,
  total: 0,
  loading: false,
  error: null
};

export const vehiclesReducer = createReducer(
  initialState,

  on(VehiclesActions.loadVehicles, (state, { page, pageSize }) => ({
    ...state,
    loading: true,
    error: null,
    page,
    pageSize
  })),

  on(VehiclesActions.loadVehiclesSuccess, (state, {response}) => ({
    ...state,
    loading: false,
    error: null,
    list: response.items,
    page: response.page,
    pageSize: response.pageSize,
    total: response.total
  })),

  on(VehiclesActions.loadVehiclesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(VehiclesActions.createVehicle, (state) => ({
    ...state,
    loading: true
  })),

  on(VehiclesActions.createVehicleSuccess, (state, { vehicle }) => ({
    ...state,
    loading: false,
    list: [vehicle, ...state.list],
    total: state.total + 1
  })),

  on(VehiclesActions.createVehicleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(VehiclesActions.updateVehicle, (state) => ({
    ...state,
    loading: true
  })),

  on(VehiclesActions.updateVehicleSuccess, (state, { vehicle }) => ({
    ...state,
    loading: false,
    list: state.list.map((v) => (v.id === vehicle.id ? vehicle : v))
  })),

  on(VehiclesActions.updateVehicleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(VehiclesActions.deleteVehicle, (state) => ({
    ...state,
    loading: true
  })),

  on(VehiclesActions.deleteVehicleSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    list: state.list.filter((v) => v.id !== id),
    total: state.total - 1
  })),

  on(VehiclesActions.deleteVehicleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export const vehiclesFeature = createFeature({
  name: 'vehicles',
  reducer: vehiclesReducer
});
