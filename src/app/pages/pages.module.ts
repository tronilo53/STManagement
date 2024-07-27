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
import { StockComponent } from './others/stock/stock.component';
import { SimulationComponent } from './admin/simulation/simulation.component';
import { TaxsComponent } from './admin/taxs/taxs.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { ChangelogComponent } from './changelog/changelog.component';



@NgModule({
  declarations: [
    PreloadComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    StockComponent,
    SimulationComponent,
    TaxsComponent,
    OrdersComponent,
    ChangelogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ComponentsModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    PreloadComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    StockComponent,
    SimulationComponent,
    TaxsComponent,
    OrdersComponent,
    ChangelogComponent
  ]
})
export class PagesModule { }
