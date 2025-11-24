import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { vehiclesFeature } from './features/vehicles/store/reducers/vehicles.reducer';
import { coordsFeature } from './features/coordinates/store/reducers/coords.reducer';
import { specialOpsFeature } from './features/vehicles/store/reducers/special-ops.reducer';

export const routes: Routes = [
  {
    path: 'vehicles',
    loadChildren: () => import('./features/vehicles/vehicles.module').then(m => m.VehiclesModule),
    providers: [
      provideState(vehiclesFeature),
      provideState(specialOpsFeature)
    ]
  },
  {
    path: 'coordinates',
    loadChildren: () => import('./features/coordinates/coords.module').then(m => m.CoordinatesModule),
    providers: [
      provideState(coordsFeature)
    ]
  },
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
