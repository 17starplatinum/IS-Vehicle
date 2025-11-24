import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinatesPageComponent } from './pages/coordinates-page/coords-page.component';
import { CoordinatesDetailPageComponent } from './pages/coordinates-detail-page/coords-detail-page.component';
import { provideState } from '@ngrx/store';
import { coordsFeature } from './store/reducers/coords.reducer';
import { CoordinatesEffects } from './store/effects/coords.effects';
import { provideEffects } from '@ngrx/effects';

const routes: Routes = [
  { path: '', 
    component: CoordinatesPageComponent,
    providers: [
        provideState(coordsFeature),
        provideEffects([CoordinatesEffects])
    ],
  },
  { path: ':id', 
    component: CoordinatesDetailPageComponent, }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinatesRoutingModule {}
