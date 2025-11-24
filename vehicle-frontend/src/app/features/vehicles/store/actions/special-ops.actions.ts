import { createAction, props } from '@ngrx/store';
import { SpecialOpName } from '../models/special-ops.models';

export const specialOpTriggered = createAction(
  '[SpecialOps] Trigger',
  props<{ op: SpecialOpName; payload?: any }>()
);

export const specialOpSuccess = createAction(
  '[SpecialOps] Success',
  props<{ op: SpecialOpName; result: any }>()
);

export const specialOpFailure = createAction(
  '[SpecialOps] Failure',
  props<{ op: SpecialOpName; error: any }>()
);

export const specialOpClear = createAction('[SpecialOps] Clear');
