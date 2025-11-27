import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as SpecialOpsActions from '../actions/special-ops.actions';
import { ApiService } from '../../../../core/services/api.service';
import { SpecialOpName } from '../models/special-ops.models';

@Injectable()
export class SpecialOpsEffects {
  private actions$ = inject(Actions);
  private api = inject(ApiService);

  runSpecial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpecialOpsActions.specialOpTriggered),
      concatMap(({ op, payload }) => {
        let request$;

        switch (op) {
          case 'sumFuelConsumption':
            request$ = this.api.getTotalFuelConsumption().pipe(
              map((num) => SpecialOpsActions.specialOpSuccess({ op, result: num })),
              catchError(error => of(SpecialOpsActions.specialOpFailure({ op, error: this.serializeError(error) })))
            );
            break;

          case 'groupByFuelConsumption':
            request$ = this.api.getGroupedByFuelConsumption().pipe(
              map((group) => SpecialOpsActions.specialOpSuccess({ op, result: group })),
              catchError(error => of(SpecialOpsActions.specialOpFailure({ op, error: this.serializeError(error) })))
            );
            break;

          case 'resetDistanceToZero':
            request$ = this.api.resetTravelledDistance(Number(payload?.id)).pipe(
              map((_) => SpecialOpsActions.specialOpSuccess({ op, result: null })),  // если reset возвращает void, можно вернуть null
              catchError(error => of(SpecialOpsActions.specialOpFailure({ op, error: this.serializeError(error) })))
            );
            break;

          default:
            return of(SpecialOpsActions.specialOpFailure({
              op,
              error: `Unknown special operation: ${op}`
            }));
        }

        return request$!;
      })
    )
  );

  private serializeError(error: any) {
    if (!error) return null;
    if (error.error && typeof error.error === 'string') return error.error;
    if (error.message) return error.message;
    return error;
  }
}
