import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WsEffects } from './features/vehicles/store/effects/ws.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ WsEffects ]
})
export class AppModule {}
