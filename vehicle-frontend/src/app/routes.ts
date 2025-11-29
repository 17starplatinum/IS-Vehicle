import { Routes } from '@angular/router';
import { VehiclesPageComponent } from './features/vehicles/pages/vehicles-page/vehicles-page.component';
import { VehicleDetailPageComponent } from './features/vehicles/pages/vehicles-detail-page/vehicles-detail-page.component';
import { CoordinatesPageComponent } from './features/coordinates/pages/coordinates-page/coords-page.component';
import { CoordinatesDetailPageComponent } from './features/coordinates/pages/coordinates-detail-page/coords-detail-page.component';

export const routes: Routes = [
  {
    path: 'vehicles',
    component: VehiclesPageComponent,
    children: [
      {
        path: ':id',
        component: VehicleDetailPageComponent,
        title: 'Vehicle Details'
      }
    ],
    title: 'Vehicles'
  },
  {
    path: 'coordinates',
    component: CoordinatesPageComponent,
    children: [
      {
        path: ':id',
        component: CoordinatesDetailPageComponent,
        title: 'Coordinates Details'
      }
    ],
    title: 'Coordinates'
  },
  { 
    path: '', 
    redirectTo: '/vehicles', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/vehicles' 
  }
];
