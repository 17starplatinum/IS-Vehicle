import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { vehiclesFeature } from './store/reducers/vehicles.reducer';
import { VehiclesEffects } from './store/effects/vehicles.effects';
import { VehiclesPageComponent } from './pages/vehicles-page/vehicles-page.component';
import { specialOpsFeature } from './store/reducers/special-ops.reducer';
import { SpecialOpsEffects } from './store/effects/special-ops.effects';
import { VehicleDetailPageComponent } from './pages/vehicles-detail-page/vehicles-detail-page.component';


export const vehiclesRoutes: Routes = [
  {
    path: '',
    component: VehiclesPageComponent,
    providers: [
      provideState(vehiclesFeature),
      provideState(specialOpsFeature),
      provideEffects([VehiclesEffects, SpecialOpsEffects])
    ],
    children: [
      { path: ':id', component: VehicleDetailPageComponent }
    ]
  }
];
