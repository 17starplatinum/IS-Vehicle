import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import * as SpecialOpsActions from '../actions/special-ops.actions';

export interface SpecialOpsState {
  loading: boolean;
  currentOp: string | null;
  result: any | null;
  error: any | null;
}

export const initialSpecialOpsState: SpecialOpsState = {
  loading: false,
  currentOp: null,
  result: null,
  error: null
};

export const specialOpsReducer = createReducer(
  initialSpecialOpsState,

  on(SpecialOpsActions.specialOpTriggered, (state, { op }) => ({
    ...state,
    loading: true,
    currentOp: op,
    result: null,
    error: null
  })),

  on(SpecialOpsActions.specialOpSuccess, (state, { op, result }) => ({
    ...state,
    loading: false,
    currentOp: op,
    result,
    error: null
  })),

  on(SpecialOpsActions.specialOpFailure, (state, { op, error }) => ({
    ...state,
    loading: false,
    currentOp: op,
    result: null,
    error
  })),

  on(SpecialOpsActions.specialOpClear, state => ({
    ...initialSpecialOpsState
  }))
);

export const specialOpsFeature = createFeature({
  name: 'specialOps',
  reducer: specialOpsReducer,
  extraSelectors: ({ selectCurrentOp, selectLoading, selectResult, selectError }) => ({
    opName: selectCurrentOp,
    isLoading: selectLoading,
    resultValue: selectResult,
    hasError: createSelector(selectError, (err) => err != null),
    errorValue: selectError
  })
});

// Экспортируем нужные селекторы и ключ
export const {
  name: specialOpsFeatureKey,
  reducer: specialOpsFeatureReducer,
  selectSpecialOpsState,
  selectCurrentOp,
  selectLoading,
  selectResult,
  selectError,
} = specialOpsFeature;
