import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './routes';
import { provideState, provideStore } from '@ngrx/store';
import { vehiclesFeature } from './features/vehicles/store/reducers/vehicles.reducer';
import { specialOpsFeature } from './features/vehicles/store/reducers/special-ops.reducer';
import { coordsFeature } from './features/coordinates/store/reducers/coords.reducer';
import { provideEffects } from '@ngrx/effects';
import { VehiclesEffects } from './features/vehicles/store/effects/vehicles.effects';
import { SpecialOpsEffects } from './features/vehicles/store/effects/special-ops.effects';
import { CoordinatesEffects } from './features/coordinates/store/effects/coords.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideStore({}),
    provideState(vehiclesFeature),
    provideState(specialOpsFeature),
    provideState(coordsFeature),
    provideEffects([VehiclesEffects, SpecialOpsEffects, CoordinatesEffects]),
    provideHttpClient()
  ]
};

export const API_PATH_VEHICLES = '/vehicles';
export const API_PATH_COORDS = '/coordinates';
export const SPECIAL_API_POSTFIX = '/special';
