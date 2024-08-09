import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadComponent } from './pages/preload/preload.component';
import { DashboardComponent } from './pages/shared/dashboard/dashboard.component';
import { HomeComponent } from './pages/others/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/others/profile/profile.component';
import { SimulationComponent } from './pages/admin/simulation/simulation.component';
import { TaxsComponent } from './pages/admin/taxs/taxs.component';
import { OrdersComponent } from './pages/admin/orders/orders.component';
import { ChangelogComponent } from './pages/changelog/changelog.component';
import { DataGuard } from './guards/data.guard';
import { ComponentsComponent } from './pages/others/components/components.component';
import { DevicesComponent } from './pages/others/devices/devices.component';
import { AddComponentsComponent } from './pages/admin/add-components/add-components.component';
import { AddDevicesComponent } from './pages/admin/add-devices/add-devices.component';
import { AddModelsComponent } from './pages/admin/add-models/add-models.component';

const routes: Routes = [
  { path: 'Preload', component: PreloadComponent },
  { path: 'ChangeLog', component: ChangelogComponent },
  { path: 'Login', component: LoginComponent },
  { 
    path: 'Dashboard', 
    canActivate: [DataGuard],
    component: DashboardComponent,
    children: [
      { path: 'Home', component: HomeComponent },
      { path: 'Components', component: ComponentsComponent },
      { path: 'Devices', component: DevicesComponent },
      { path: 'Simulation', component: SimulationComponent },
      { path: 'Taxs', component: TaxsComponent },
      { path: 'Orders', component: OrdersComponent },
      { path: 'AddComponents', component: AddComponentsComponent },
      { path: 'AddDevices', component: AddDevicesComponent },
      { path: 'AddModels', component: AddModelsComponent },
      { path: 'Profile', component: ProfileComponent },
      { path: '**', pathMatch: 'full', redirectTo: 'Home' }
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'Dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
