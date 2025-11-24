import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CoordinatesState } from '../reducers/coords.reducer';
import { Coordinates } from '../models/coords.models';

export const selectCoordinatesFeature =
  createFeatureSelector<CoordinatesState>('coordinates');

export const selectCoordinatesList = createSelector(
  selectCoordinatesFeature,
  (state) => state.list
);

export const selectCoordinatesLoading = createSelector(
  selectCoordinatesFeature,
  (state) => state.loading
);

export const selectCoordinatesError = createSelector(
  selectCoordinatesFeature,
  (state) => state.error
);

export const selectCoordinatesPage = createSelector(
  selectCoordinatesFeature,
  (state) => state.page
);

export const selectCoordinatesPageSize = createSelector(
  selectCoordinatesFeature,
  (state) => state.pageSize
);

export const selectCoordinatesTotal = createSelector(
  selectCoordinatesFeature,
  (state) => state.total
);

export const selectCoordinatesById = (id: number) =>
  createSelector(selectCoordinatesList, (list) => list.find((v) => v.id === id) as Coordinates | undefined);

export const selectCoordinatesTableData = createSelector(
  selectCoordinatesList,
  selectCoordinatesPage,
  selectCoordinatesPageSize,
  (list, page, pageSize) => ({
    data: list,
    page,
    pageSize
  })
);
