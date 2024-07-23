import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';



@NgModule({
  declarations: [
    NavbarComponent,
    MaintenanceComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarComponent,
    MaintenanceComponent
  ]
})
export class ComponentsModule { }
