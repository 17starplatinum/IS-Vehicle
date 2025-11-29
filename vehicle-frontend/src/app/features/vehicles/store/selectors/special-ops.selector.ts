import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SpecialOpsState } from '../reducers/special-ops.reducer';

export const selectSpecialOpsFeature = createFeatureSelector<SpecialOpsState>('specialOps');

export const selectSpecialOpsLoading = createSelector(selectSpecialOpsFeature, s => s.loading);
export const selectSpecialOpsCurrentOp = createSelector(selectSpecialOpsFeature, s => s.currentOp ?? '');

export const selectSpecialOpsResult = createSelector(
  selectSpecialOpsFeature,
  (state) => {
    const res = state.result;

    if (!res) return res;

    if (res.map && typeof res.map === 'object') {
      return Object.entries(res.map).map(([fuel, count]) => ({
        fuelConsumption: Number(fuel),
        count: count as number
      }));
    }

    if (typeof res.message === 'number') {
      return res.message;
    }

    return res;
  }
);

export const selectSpecialOpsError = createSelector(selectSpecialOpsFeature, s => s.error);
