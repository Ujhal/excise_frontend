import { Routes } from '@angular/router';
import { LicenseeDashboardComponent } from './licensee-dashboard/licensee-dashboard.component';
import { LicenseeHomeComponent } from './licensee-home/licensee-home.component';
import { ApplyLicenseComponent } from './apply-license/apply-license.component';

// Define the routes for the Licensee module
export const licenseeRoutes: Routes = [
  {
    path: '',
    component: LicenseeHomeComponent, // Acts as a layout or wrapper component
    children: [
      {
        path: 'dashboard',
        component: LicenseeDashboardComponent, // Route for licensee dashboard
      },
      {
        path: 'apply-license',
        component: ApplyLicenseComponent, // Route for applying for a license
      },
      {
        path: '',
        redirectTo: '/licensee/dashboard', // Redirect to dashboard if no child path is provided
        pathMatch: 'full'
      },
    ],
  },
];
