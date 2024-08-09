import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { PreloadComponent } from './preload/preload.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { HomeComponent } from './others/home/home.component';
import { ComponentsModule } from '../components/components.module';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './others/profile/profile.component';
import { SimulationComponent } from './admin/simulation/simulation.component';
import { TaxsComponent } from './admin/taxs/taxs.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { ComponentsComponent } from './others/components/components.component';
import { DevicesComponent } from './others/devices/devices.component';
import { DirectivesModule } from '../directives/directives.module';
import { AddComponentsComponent } from './admin/add-components/add-components.component';
import { AddDevicesComponent } from './admin/add-devices/add-devices.component';
import { AddModelsComponent } from './admin/add-models/add-models.component';



@NgModule({
  declarations: [
    PreloadComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    SimulationComponent,
    TaxsComponent,
    OrdersComponent,
    ChangelogComponent,
    ComponentsComponent,
    DevicesComponent,
    AddComponentsComponent,
    AddDevicesComponent,
    AddModelsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ComponentsModule,
    HttpClientModule,
    FormsModule,
    DirectivesModule
  ],
  exports: [
    PreloadComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    SimulationComponent,
    TaxsComponent,
    OrdersComponent,
    ChangelogComponent,
    ComponentsComponent,
    DevicesComponent
  ]
})
export class PagesModule { }
