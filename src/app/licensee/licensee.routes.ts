import { Routes } from '@angular/router';
import { LicenseeDashboardComponent } from './licensee-dashboard/licensee-dashboard.component';
import { LicenseeHomeComponent } from './licensee-home/licensee-home.component';

export const licenseeRoutes: Routes = [
  {
    path: '',
    component: LicenseeHomeComponent,
    children: [
      {
        path: 'dashboard',
        component: LicenseeDashboardComponent,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default route
    ],
  },
];

