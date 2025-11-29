import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, concatMap, map, switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as VehiclesActions from '../actions/vehicles.actions';
import { ApiService } from '../../../../core/services/api.service';
import { CreateVehicleRequest } from '../models/vehicles.models';
import { buildCreateVehicleRequest } from '../helper';

@Injectable()
export class VehiclesEffects {
  private actions$ = inject(Actions);
  private api = inject(ApiService);

  constructor() {
    console.log('VehiclesEffects ctor — actions, api:', !!this.actions$, !!this.api);
  }

  loadVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.loadVehicles),
      concatMap(() =>
        this.api.getVehicles().pipe(
          tap(r => console.log('[VehiclesEffects] api.getVehicles response', r)),
          map(response => VehiclesActions.loadVehiclesSuccess({ response })),
          catchError(error => of(VehiclesActions.loadVehiclesFailure({ error })))
        )
      )
    )
  );

  getVehicle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.loadVehicle),
      concatMap(({id}) =>
        this.api.getVehicle(id).pipe(
          map((vehicle) => VehiclesActions.createVehicleSuccess({ vehicle })),
          catchError((error) => of(VehiclesActions.loadVehicleFailure({ error })))
        )
      )
    )
  );

	createVehicle$ = createEffect(() =>
  		this.actions$.pipe(
    		ofType(VehiclesActions.createVehicle),
    			concatMap(({ vehicle: vehiclePartial }) => {
      				let payload: CreateVehicleRequest;
      				try {
        				payload = buildCreateVehicleRequest(vehiclePartial);
      				} catch (err) {
        				return of(VehiclesActions.createVehicleFailure({ error: err instanceof Error ? err.message : err }));
      				}

      				const coords = payload.coordinates;

					if (!coords || 'id' in coords) {
						return this.api.createVehicle(payload).pipe(
						map((created) => VehiclesActions.createVehicleSuccess({ vehicle: created })),
						catchError((error) => of(VehiclesActions.createVehicleFailure({ error })))
						);
					}

			return this.api.createCoordinates({ x: coords.x, y: coords.y }).pipe(
				switchMap((createdCoord) => {
				const payloadWithCoordRef: CreateVehicleRequest = {
					...payload,
					coordinates: { id: createdCoord.id }
				};
				return this.api.createVehicle(payloadWithCoordRef).pipe(
					map((createdVehicle) => VehiclesActions.createVehicleSuccess({ vehicle: createdVehicle })),
					catchError((error) => of(VehiclesActions.createVehicleFailure({ error })))
				);
				}),
				catchError((error) => of(VehiclesActions.createVehicleFailure({ error })))
			);
		})
  	)
);

  updateVehicle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.updateVehicle),
      concatMap(({ id, changes }) =>
        this.api.updateVehicle(id, changes).pipe(
          map((updated) => VehiclesActions.updateVehicleSuccess({ vehicle: updated })),
          catchError((error) => of(VehiclesActions.updateVehicleFailure({ error })))
        )
      )
    )
  );

  deleteVehicle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.deleteVehicle),
      mergeMap(({ id }) =>
        this.api.deleteVehicle(id).pipe(
          map(() => VehiclesActions.deleteVehicleSuccess({ id })),
          catchError((error) => of(VehiclesActions.deleteVehicleFailure({ error })))
        )
      )
    )
  );
}
