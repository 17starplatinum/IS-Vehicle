import { RouterModule, Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { vehiclesFeature } from './features/vehicles/store/reducers/vehicles.reducer';
import { coordsFeature } from './features/coordinates/store/reducers/coords.reducer';
import { specialOpsFeature } from './features/vehicles/store/reducers/special-ops.reducer';
import { NgModule } from '@angular/core';
import { loadVehicles } from './features/vehicles/store/actions/vehicles.actions';
import { loadCoordinatesList } from './features/coordinates/store/actions/coords.actions';

export const routes: Routes = [
  {
    path: 'vehicles',
    loadComponent: () => import('./features/vehicles/pages/vehicles-page/vehicles-page.component').then(c => c.VehiclesPageComponent),
    providers: [
      provideState(vehiclesFeature),
      provideState(specialOpsFeature),
      {
        provide: 'LOAD_DATA',
        useValue: (store: any) => store.dispatch(loadVehicles({ page: 0, pageSize: 10, sortBy: 'id', ascending: true, fuelType: "", min: null, max: null, filter: "" }))
      }
    ],
    children: [
      {
        path: ':id',
        loadComponent: () => import('./features/vehicles/pages/vehicles-detail-page/vehicles-detail-page.component').then(c => c.VehicleDetailPageComponent)
      }
    ]
  },
  {
    path: 'coordinates',
    loadComponent: () => import('./features/coordinates/pages/coordinates-page/coords-page.component').then(c => c.CoordinatesPageComponent),
    providers: [
      provideState(coordsFeature),
      {
        provide: 'LOAD_DATA',
        useValue: (store: any) => store.dispatch(loadCoordinatesList({ page: 0, pageSize: 10, sortBy: 'id', ascending: true }))
      }
    ],
    children: [
      {
        path: ':id',
        loadComponent: () => import('./features/coordinates/pages/coordinates-detail-page/coords-detail-page.component').then(c => c.CoordinatesDetailPageComponent)
      }
    ]
  },
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
  { path: '**', redirectTo: 'vehicles' }
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] })
export class AppRoutingModule {}
