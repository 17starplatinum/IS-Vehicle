import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedMaterialModule } from './shared-material/shared-material.module';
import { NotificationCenterComponent } from './components/notification/notification-center.component';

@NgModule({
  declarations: [
    NotificationCenterComponent,
  ],
  imports: [
    NgCommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedMaterialModule
  ],
  exports: [
    NgCommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedMaterialModule,
    NotificationCenterComponent,
  ]
})
export class CommonModule {}
