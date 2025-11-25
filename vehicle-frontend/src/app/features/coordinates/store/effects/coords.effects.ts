import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, concatMap, map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as CoordsActions from '../actions/coords.actions';
import { ApiService } from '../../../../core/services/api.service';

@Injectable()
export class CoordinatesEffects {
  
  private actions$ = inject(Actions);
  private api = inject(ApiService);
  
  constructor() {}

  loadCoordinatesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoordsActions.loadCoordinatesList),
      concatMap(() =>
        this.api.getCoordinatesList().pipe(
          map((response) => 
            CoordsActions.loadCoordinatesListSuccess({ 
              response
            })),
          catchError((error) => of(CoordsActions.loadCoordinatesListFailure({ error })))
        )
      )
    )
  );

  getCoordinates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoordsActions.loadCoordinates),
      concatMap(({id}) =>
        this.api.getCoordinates(id).pipe(
          map((coordinates) => CoordsActions.createCoordinatesSuccess({ coordinates })),
          catchError((error) => of(CoordsActions.loadCoordinatesFailure({ error })))
        )
      )
    )
  );

  createCoordinates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoordsActions.createCoordinates),
      concatMap(({ coordinates }) =>
        this.api.createCoordinates(coordinates).pipe(
          map((created) => CoordsActions.createCoordinatesSuccess({ coordinates: created })),
          catchError((error) => of(CoordsActions.createCoordinatesFailure({ error })))
        )
      )
    )
  );

  updateCoordinates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoordsActions.updateCoordinates),
      concatMap(({ id, changes }) =>
        this.api.updateCoordinates(id, changes).pipe(
          map((updated) => CoordsActions.updateCoordinatesSuccess({ coordinates: updated })),
          catchError((error) => of(CoordsActions.updateCoordinatesFailure({ error })))
        )
      )
    )
  );

  deleteCoordinates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoordsActions.deleteCoordinates),
      mergeMap(({ id }) =>
        this.api.deleteCoordinates(id).pipe(
          map(() => CoordsActions.deleteCoordinatesSuccess({ id })),
          catchError((error) => of(CoordsActions.deleteCoordinatesFailure({ error })))
        )
      )
    )
  );

}
