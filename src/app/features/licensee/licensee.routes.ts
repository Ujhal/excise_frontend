import { Routes } from '@angular/router';
import { LicenseeDashboardComponent } from './licensee-dashboard/licensee-dashboard.component';
import { LicenseeHomeComponent } from './licensee-home/licensee-home.component';
import { ApplyLicenseComponent } from './apply-license/apply-license.component';
import { UserRouteAccessService } from '../../core/config/user-route-access.service';
import { Authority } from '../../shared/constants/authority.enum';

// Define the routes for the Licensee module
export const licenseeRoutes: Routes = [
  {
    path: '',
    component: LicenseeHomeComponent, // Acts as a layout or wrapper component
    children: [
      {
        path: 'dashboard',
        component: LicenseeDashboardComponent, // Route for licensee dashboard
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.LICENSEE]
        },
      },
      {
        path: 'apply-license',
        component: ApplyLicenseComponent, // Route for applying for a license
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.LICENSEE]
        },
      },
      {
        path: 'company-registration',
        children: [
          {
            path: 'prepare-company-application',
            loadComponent: () => import('./company-registration/prepare-application/prepare-application.component').then(m => m.PrepareApplicationComponent),
            canActivate: [UserRouteAccessService],
            data: {
              authorities: [Authority.LICENSEE]            
            },
          },
          {
            path: 'act-on-application',
            loadComponent: () => import('./company-registration/act-on-application/act-on-application.component').then(m => m.ActOnApplicationComponent),
            canActivate: [UserRouteAccessService],
            data: {
              authorities: [Authority.LICENSEE]            
            },
          },
          {
            path: 'print-company-certificate',
            loadComponent: () => import('./company-registration/print-certificate/print-certificate.component').then(m => m.PrintCertificateComponent),
            canActivate: [UserRouteAccessService],
            data: {
              authorities: [Authority.LICENSEE]            
            },
          },
        ]
      },
      {
        path: 'salesman-registration',
        children: [
          {
            path: 'prepare-salesman-application',
            loadComponent: () => import('./salesman-registration/prepare-application/prepare-application.component').then(m => m.PrepareApplicationComponent),
            canActivate: [UserRouteAccessService],
            data: {
              authorities: [Authority.LICENSEE]            
            },
          },
          {
            path: 'act-on-draft-application',
            loadComponent: () => import('./salesman-registration/act-on-draft-application/act-on-draft-application.component').then(m => m.ActOnDraftApplicationComponent),
            canActivate: [UserRouteAccessService],
            data: {
              authorities: [Authority.LICENSEE]            
            },
          },
          {
            path: 'print-salesman-certificate',
            loadComponent: () => import('./salesman-registration/print-certificate/print-certificate.component').then(m => m.PrintCertificateComponent),
            canActivate: [UserRouteAccessService],
            data: {
              authorities: [Authority.LICENSEE]            
            },
          },
          {
            path: 'application-status',
            loadComponent: () => import('./salesman-registration/application-status/application-status.component').then(m => m.ApplicationStatusComponent),
            canActivate: [UserRouteAccessService],
            data: {
              authorities: [Authority.LICENSEE]            
            },
          }
        ]
      },
      {
        path: '',
        redirectTo: '/licensee/dashboard', // Redirect to dashboard if no child path is provided
        pathMatch: 'full'
      },
    ],
  },
];
