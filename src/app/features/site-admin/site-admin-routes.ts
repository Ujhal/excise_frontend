import { Routes } from '@angular/router';
import { UserRouteAccessService } from '../../core/config/user-route-access.service';

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
      {
        path: 'add-policestation',
        loadComponent: () => import('./add-policestation/add-policestation.component').then(m => m.AddPolicestationComponent)
      },
      { path: 'site-admin/edit-policestation/:id', loadComponent: () => import('./add-policestation/add-policestation.component').then(m => m.AddPolicestationComponent)}, 
      {
        path: 'list-policestation',
        loadComponent: () => import('./list-policestation/list-policestation.component').then(m => m.ListPolicestationComponent),
      },
      {
        path: 'add-licensetype',
        loadComponent: () => import('./add-licensetype/add-licensetype.component').then(m => m.AddLicensetypeComponent),
      },
      {
        path: 'list-licensetype',
        loadComponent: () => import('./list-licensetype/list-licensetype.component').then(m => m.ListLicensetypeComponent),
      },
      {
        path: 'add-licensecategory',
        loadComponent: () => import('./add-licensecategory/add-licensecategory.component').then(m => m.AddLicensecategoryComponent),
      },
      {
        path: 'list-licensecategory',
        loadComponent: () => import('./list-licensecategory/list-licensecategory.component').then(m => m.ListLicensecategoryComponent),
      },
      {
        path: 'company-registration',
        children: [
          { path: 'prepare-company-application', loadComponent: () => import('./company-registration/prepare-application/prepare-application.component').then(m => m.PrepareApplicationComponent) },
          { path: 'act-on-application', loadComponent: () => import('./company-registration/act-on-application/act-on-application.component').then(m => m.ActOnApplicationComponent) },
          { path: 'print-company-certificate', loadComponent: () => import('./company-registration/print-certificate/print-certificate.component').then(m => m.PrintCertificateComponent) },
        ]
      }, 
      {
        path: 'salesman-registration',
        children: [
          { path: 'prepare-salesman-application', loadComponent: () => import('./salesman-registration/prepare-application/prepare-application.component').then(m => m.PrepareApplicationComponent) },
          { path: 'act-on-draft-application', loadComponent: () => import('./salesman-registration/act-on-draft-application/act-on-draft-application.component').then(m => m.ActOnDraftApplicationComponent) },
          { path: 'print-salesman-certificate', loadComponent: () => import('./salesman-registration/print-certificate/print-certificate.component').then(m => m.PrintCertificateComponent) },
          { path: 'application-status', loadComponent: () => import('./salesman-registration/application-status/application-status.component').then(m => m.ApplicationStatusComponent) }
        ]
      },   
    ],
  },
];


export default routes;