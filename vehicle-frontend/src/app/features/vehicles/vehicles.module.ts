import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesPageComponent } from './pages/vehicles-page/vehicles-page.component';
import { VehicleDetailPageComponent } from './pages/vehicles-detail-page/vehicles-detail-page.component';
import { SharedMaterialModule } from '../../common/shared-material/shared-material.module';
import { VehiclesTableComponent } from './components/tables/vehicles-table.component';
import { VehicleFormDialogComponent } from './components/forms/vehicle-form-dialog.component';
import { SpecialOpsPanelComponent } from './components/special-ops-panel/special-ops-panel.component';
import { VehicleDetailComponent } from './components/details/vehicle-detail.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    VehiclesPageComponent,
    VehicleDetailComponent,
    VehicleDetailPageComponent,
    VehiclesTableComponent,
    VehicleFormDialogComponent,
    SpecialOpsPanelComponent
  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
    RouterModule
  ],
  providers: []
})
export class VehiclesModule {}
