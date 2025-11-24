import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SpecialOpsState } from '../reducers/special-ops.reducer';

export const selectSpecialOpsFeature = createFeatureSelector<SpecialOpsState>('specialOps');

export const selectSpecialOpsLoading = createSelector(selectSpecialOpsFeature, s => s.loading);
export const selectSpecialOpsCurrentOp = createSelector(selectSpecialOpsFeature, s => s.currentOp ?? '');
export const selectSpecialOpsResult = createSelector(selectSpecialOpsFeature, s => s.result);
export const selectSpecialOpsError = createSelector(selectSpecialOpsFeature, s => s.error);
