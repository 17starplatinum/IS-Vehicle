import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VehiclesState } from '../reducers/vehicles.reducer';
import { Vehicle } from '../models/vehicles.models';

export const selectVehiclesFeature =
  createFeatureSelector<VehiclesState>('vehicles');

export const selectVehiclesList = createSelector(
  selectVehiclesFeature,
  (state) => state.list
);

export const selectVehiclesLoading = createSelector(
  selectVehiclesFeature,
  (state) => state.loading
);

export const selectVehiclesError = createSelector(
  selectVehiclesFeature,
  (state) => state.error
);

export const selectVehiclesPage = createSelector(
  selectVehiclesFeature,
  (state) => state.page
);

export const selectVehiclesPageSize = createSelector(
  selectVehiclesFeature,
  (state) => state.pageSize
);

export const selectVehiclesTotal = createSelector(
  selectVehiclesFeature,
  (state) => state.total
);

export const selectVehicleById = (id: number) =>
  createSelector(selectVehiclesList, (list) => list.find((v) => v.id === id) as Vehicle | undefined);

export const selectVehiclesTableData = createSelector(
  selectVehiclesList,
  selectVehiclesPage,
  selectVehiclesPageSize,
  (list, page, pageSize) => ({
    data: list,
    page,
    pageSize
  })
);
