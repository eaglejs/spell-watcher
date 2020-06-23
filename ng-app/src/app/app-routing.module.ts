import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RoutingPaths } from './routing-paths';

const routes: Routes = [
  {
    path: '',
    redirectTo: `/${RoutingPaths.DASHBOARD}`,
    pathMatch: 'full'
  },
  {
    path: RoutingPaths.DASHBOARD,
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
