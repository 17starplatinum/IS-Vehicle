import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinatesPageComponent } from './pages/coordinates-page/coords-page.component';
import { CoordinatesDetailPageComponent } from './pages/coordinates-detail-page/coords-detail-page.component';
import { CoordinatesRoutingModule } from './coords-routing.module';
import { CoordsFormDialogComponent } from './components/forms/coordinates-form-dialog.component';
import { SharedMaterialModule } from '../../common/shared-material/shared-material.module';
import { CoordinatesTableComponent } from './components/tables/coords-table.component';
import { CoordinatesDetailComponent } from './components/details/coords-detail.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CoordinatesPageComponent,
    CoordinatesDetailPageComponent,
    CoordinatesDetailComponent,
    CoordinatesTableComponent,
    CoordsFormDialogComponent
  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
    RouterModule,
    CoordinatesRoutingModule
  ],
  providers: []
})
export class CoordinatesModule {}

