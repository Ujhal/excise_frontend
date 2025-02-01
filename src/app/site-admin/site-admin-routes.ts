import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserRouteAccessService } from '../config/user-route-access.service';

const routes: Routes = [
  {
    path: '', // Parent route
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboardtest/dashboardtest.component').then(m => m.DashboardtestComponent),
      },
      {
        path: 'new-district',
        loadComponent: () => import('./add-district/add-district.component').then(m => m.AddDistrictComponent),
      },
      {
        path: 'list-district',
        loadComponent: () => import('./list-district/list-district.component').then(m => m.ListDistrictComponent),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteAdminRoutesModule {}