import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinatesPageComponent } from './pages/coordinates-page/coords-page.component';
import { CoordinatesDetailPageComponent } from './pages/coordinates-detail-page/coords-detail-page.component';

const routes: Routes = [
  { path: '', 
    component: CoordinatesPageComponent,
    providers: [],
  },
  { path: ':id', 
    component: CoordinatesDetailPageComponent, }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinatesRoutingModule {}
