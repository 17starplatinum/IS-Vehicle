import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { map, filter } from 'rxjs/operators';
import { WsService } from '../../../../core/services/ws.service';
import * as VehiclesActions from '../actions/vehicles.actions';

@Injectable()
export class WsEffects {
  constructor(private ws: WsService) {}

  wsEvents$ = createEffect(() =>
    this.ws.events$.pipe(
      filter(evt => !!evt),
      map(evt => {
        if (evt.resource === 'vehicle') {
          if (evt.action === 'CREATED' || evt.action === 'UPDATED') {
            return VehiclesActions.loadVehicle({ id: evt.id! });
          }
          if (evt.action === 'DELETED') {
            return VehiclesActions.deleteVehicleSuccess({ id: evt.id! });
          }
          if (evt.action === 'RESET_DISTANCE') {
            return VehiclesActions.loadVehicle({ id: evt.id! });
          }
        }

        return { type: '[WS] Unknown event', event: evt };
      })
    )
  );
}
