import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideState, provideStore } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { VehiclesEffects } from './app/features/vehicles/store/effects/vehicles.effects';
import { SpecialOpsEffects } from './app/features/vehicles/store/effects/special-ops.effects';
import { CoordinatesEffects } from './app/features/coordinates/store/effects/coords.effects';
import { vehiclesFeature } from './app/features/vehicles/store/reducers/vehicles.reducer';
import { specialOpsFeature } from './app/features/vehicles/store/reducers/special-ops.reducer';
import { coordsFeature } from './app/features/coordinates/store/reducers/coords.reducer';

bootstrapApplication(App, {
  providers: [
    ...appConfig.providers,
    provideHttpClient(),
    provideStore({}),
    provideState(vehiclesFeature),
    provideState(specialOpsFeature),
    provideState(coordsFeature),
    provideEffects([VehiclesEffects, SpecialOpsEffects, CoordinatesEffects])
  ]
}).catch(err => console.error(err));

