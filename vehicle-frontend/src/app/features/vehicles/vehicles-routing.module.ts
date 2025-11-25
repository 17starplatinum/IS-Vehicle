import { RouterModule, Routes } from '@angular/router';
import { VehiclesPageComponent } from './pages/vehicles-page/vehicles-page.component';
import { VehicleDetailPageComponent } from './pages/vehicles-detail-page/vehicles-detail-page.component';
import { NgModule } from '@angular/core';

export const vehiclesRoutes: Routes = [
  {
    path: '',
    component: VehiclesPageComponent,
    providers: [],
    children: [
      { path: ':id', component: VehicleDetailPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(vehiclesRoutes)],
  exports: [RouterModule]
})
export class VehiclesRoutingModule {}

