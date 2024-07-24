import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { PreloadComponent } from './preload/preload.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { HomeComponent } from './others/home/home.component';
import { ComponentsModule } from '../components/components.module';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    PreloadComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ComponentsModule,
    HttpClientModule
  ],
  exports: [
    PreloadComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent
  ]
})
export class PagesModule { }
