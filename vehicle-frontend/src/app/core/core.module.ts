

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ContentTypeInterceptor } from './interceptors/content-type.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoordinatesRoutingModule } from '../features/coordinates/coords-routing.module';
import { SharedMaterialModule } from '../common/shared-material/shared-material.module';
import { coordinatesReducer } from '../features/coordinates/store/reducers/coords.reducer';
import { CoordinatesEffects } from '../features/coordinates/store/effects/coords.effects';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
    CoordinatesRoutingModule,
    StoreModule.forFeature('coordinates', coordinatesReducer),
    EffectsModule.forFeature([CoordinatesEffects])
  ],
  providers: [
  { provide: HTTP_INTERCEPTORS, useClass: ContentTypeInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
]
})
export class CoreModule {}