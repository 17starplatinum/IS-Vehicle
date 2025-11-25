import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WsEffects } from './features/vehicles/store/effects/ws.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    AppRoutingModule
  ],
  providers: [ WsEffects ]
})
export class AppModule {}
