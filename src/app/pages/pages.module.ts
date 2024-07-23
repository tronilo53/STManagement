import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadComponent } from './preload/preload.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './others/home/home.component';
import { ComponentsModule } from '../components/components.module';



@NgModule({
  declarations: [
    PreloadComponent,
    DashboardComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ComponentsModule
  ],
  exports: [
    PreloadComponent,
    DashboardComponent
  ]
})
export class PagesModule { }
