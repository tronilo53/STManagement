import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadComponent } from './pages/preload/preload.component';

const routes: Routes = [
  { path: 'Preload', component: PreloadComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'Preload' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
