import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadComponent } from './pages/preload/preload.component';
import { DashboardComponent } from './pages/shared/dashboard/dashboard.component';
import { HomeComponent } from './pages/others/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/others/profile/profile.component';
import { StockComponent } from './pages/others/stock/stock.component';
import { SimulationComponent } from './pages/admin/simulation/simulation.component';
import { TaxsComponent } from './pages/admin/taxs/taxs.component';
import { OrdersComponent } from './pages/admin/orders/orders.component';
import { ChangelogComponent } from './pages/changelog/changelog.component';

const routes: Routes = [
  { path: 'Preload', component: PreloadComponent },
  { path: 'ChangeLog', component: ChangelogComponent },
  { path: 'Login', component: LoginComponent },
  { 
    path: 'Dashboard', 
    component: DashboardComponent,
    children: [
      { path: 'Home', component: HomeComponent },
      { path: 'Stock', component: StockComponent },
      { path: 'Simulation', component: SimulationComponent },
      { path: 'Taxs', component: TaxsComponent },
      { path: 'Orders', component: OrdersComponent },
      { path: 'Profile', component: ProfileComponent },
      { path: '**', pathMatch: 'full', redirectTo: 'Home' }
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'Preload' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
