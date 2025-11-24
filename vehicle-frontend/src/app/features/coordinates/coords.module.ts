import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinatesPageComponent } from './pages/coordinates-page/coords-page.component';
import { CoordinatesDetailPageComponent } from './pages/coordinates-detail-page/coords-detail-page.component';
import { CoordinatesRoutingModule } from './coords-routing.module';
import { CoordsFormDialogComponent } from './components/forms/coordinates-form-dialog.component';
import { SharedMaterialModule } from '../../common/shared-material/shared-material.module';
import { CoordinatesTableComponent } from './components/tables/coords-table.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { coordinatesReducer } from './store/reducers/coords.reducer';
import { CoordinatesEffects } from './store/effects/coords.effects';
import { MatDialogModule } from '@angular/material/dialog';
import { CoordinatesDetailComponent } from './components/details/coords-detail.component';

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
    CoordinatesRoutingModule,
    StoreModule.forFeature('coordinates', coordinatesReducer),
    EffectsModule.forFeature([CoordinatesEffects])
  ],
  providers: []
})
export class CoordinatesModule {}

