import { Routes } from '@angular/router';
import { LicenseeDashboardComponent } from './licensee-dashboard/licensee-dashboard.component';
import { LicenseeHomeComponent } from './licensee-home/licensee-home.component';
import { ApplyLicenseComponent } from './apply-license/apply-license.component';

export const licenseeRoutes: Routes = [
  {
    path: '',
    component: LicenseeHomeComponent,
    children: [
      {
        path: 'dashboard',
        component: LicenseeDashboardComponent,
      },
      {
        path: 'apply-license',
        component: ApplyLicenseComponent
      },   
      { path: '', redirectTo: '/licensee/dashboard', pathMatch: 'full' },
    ],
  }, 
];

