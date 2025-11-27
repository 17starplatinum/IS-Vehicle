import { NgModule } from "@angular/core";
import { RouterLinkActive, RouterModule } from "@angular/router";
import { routes } from "./routes";

@NgModule({ 
  imports: [
    RouterModule.forChild(routes),
    RouterLinkActive
  ], 
  exports: [RouterModule] })
export class AppRoutingModule {}
