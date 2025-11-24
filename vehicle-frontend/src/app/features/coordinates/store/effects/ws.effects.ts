import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { map, filter } from 'rxjs/operators';
import { WsService } from '../../../../core/services/ws.service';
import * as CoordsActions from '../actions/coords.actions';

@Injectable()
export class WsEffects {
  constructor(private ws: WsService) {}

  wsEvents$ = createEffect(() =>
    this.ws.events$.pipe(
      filter(evt => !!evt),
      map(evt => {

        if (evt.resource === 'coordinates') {
          if (evt.action === 'CREATED' || evt.action === 'UPDATED') {
            return CoordsActions.loadCoordinates({ id: evt.id! });
          }
          if (evt.action === 'DELETED') {
            return CoordsActions.deleteCoordinatesSuccess({ id: evt.id! });
          }
        }

        return { type: '[WS] Unknown event', event: evt };
      })
    )
  );
}
