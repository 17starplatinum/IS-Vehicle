import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WsEffects } from './features/vehicles/store/effects/ws.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule
  ],
  providers: [ WsEffects ]
})
export class AppModule {}
