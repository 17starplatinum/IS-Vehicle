import { createFeature, createReducer, on } from '@ngrx/store';
import { Coordinates } from '../models/coords.models';
import * as CoordinatesActions from '../actions/coords.actions';

export interface CoordinatesState {
  list: Coordinates[];
  sortBy: string,
  page: number;
  pageSize: number;
  ascending: boolean;
  total: number;
  loading: boolean;
  error: any;
}

export const initialState: CoordinatesState = {
  list: [],
  sortBy: 'id',
  page: 1,
  pageSize: 10,
  ascending: true,
  total: 0,
  loading: false,
  error: null
};

export const coordinatesReducer = createReducer(
  initialState,

  on(CoordinatesActions.loadCoordinatesList, (state, { page, pageSize }) => ({
    ...state,
    loading: true,
    error: null,
    page,
    pageSize
  })),

  on(CoordinatesActions.loadCoordinatesListSuccess, (state, {response}) => ({
    ...state,
    loading: false,
    error: null,
    list: response.items,
    page: response.page,
    pageSize: response.pageSize,
    total: response.total
  })),

  on(CoordinatesActions.loadCoordinatesListFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(CoordinatesActions.createCoordinates, (state) => ({
    ...state,
    loading: true
  })),

  on(CoordinatesActions.createCoordinatesSuccess, (state, { coordinates }) => ({
    ...state,
    loading: false,
    list: [coordinates, ...state.list],
    total: state.total + 1
  })),

  on(CoordinatesActions.createCoordinatesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(CoordinatesActions.updateCoordinates, (state) => ({
    ...state,
    loading: true
  })),

  on(CoordinatesActions.updateCoordinatesSuccess, (state, { coordinates }) => ({
    ...state,
    loading: false,
    list: state.list.map((v) => (v.id === coordinates.id ? coordinates : v))
  })),

  on(CoordinatesActions.updateCoordinatesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(CoordinatesActions.deleteCoordinates, (state) => ({
    ...state,
    loading: true
  })),

  on(CoordinatesActions.deleteCoordinatesSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    list: state.list.filter((v) => v.id !== id),
    total: state.total - 1
  })),

  on(CoordinatesActions.deleteCoordinatesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export const coordsFeature = createFeature({
  name: 'coordinates',
  reducer: coordinatesReducer
});
