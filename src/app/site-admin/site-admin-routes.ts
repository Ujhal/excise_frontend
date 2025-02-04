import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserRouteAccessService } from '../config/user-route-access.service';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [UserRouteAccessService],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'new-district',
        loadComponent: () => import('./add-district/add-district.component').then(m => m.AddDistrictComponent),
      },
      {
        path: 'list-district',
        loadComponent: () => import('./list-district/list-district.component').then(m => m.ListDistrictComponent),
      },
      {
        path: 'add-subdivision',
        loadComponent: () => import('./add-subdivision/add-subdivision.component').then(m => m.AddSubdivisionComponent),
      },
      {
        path: 'list-subdivision',
        loadComponent: () => import('./list-subdivision/list-subdivision.component').then(m => m.ListSubdivisionComponent),
      },
      {
        path: 'add-user',
        loadComponent: () => import('./add-user/add-user.component').then(m => m.AddUserComponent),
      },
      {
        path: 'list-user',
        loadComponent: () => import('./list-user/list-user.component').then(m => m.ListUserComponent),
      },
    ],
  },
];


export default routes;