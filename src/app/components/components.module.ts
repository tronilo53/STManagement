import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { RouterModule } from '@angular/router';
import { NavbarThemeComponent } from './navbar-theme/navbar-theme.component';



@NgModule({
  declarations: [
    NavbarComponent,
    MaintenanceComponent,
    NavbarThemeComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    MaintenanceComponent,
    NavbarThemeComponent
  ]
})
export class ComponentsModule { }
