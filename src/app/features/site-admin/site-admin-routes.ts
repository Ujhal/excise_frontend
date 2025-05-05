import { Routes } from '@angular/router';
import { UserRouteAccessService } from '../../core/config/user-route-access.service';
import { Authority } from '../../shared/constants/authority.enum';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [UserRouteAccessService], // Protect this route based on the user role
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [UserRouteAccessService], // Protect with role check
        data: {
          authorities: [Authority.SITE_ADMIN, Authority.COMMISSIONER, Authority.JOINT_COMMISSIONER, Authority.PERMIT_SECTION]
        },
      },
      {
        path: 'new-district',
        loadComponent: () => import('./add-district/add-district.component').then(m => m.AddDistrictComponent),
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.SITE_ADMIN]
        },
      },
      {
        path: 'list-district',
        loadComponent: () => import('./list-district/list-district.component').then(m => m.ListDistrictComponent),
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.SITE_ADMIN]
        },
      },
      {
        path: 'add-subdivision',
        loadComponent: () => import('./add-subdivision/add-subdivision.component').then(m => m.AddSubdivisionComponent),
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.SITE_ADMIN]
        },
      },
      {
        path: 'list-subdivision',
        loadComponent: () => import('./list-subdivision/list-subdivision.component').then(m => m.ListSubdivisionComponent),
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.SITE_ADMIN]
        },
      },
      {
        path: 'add-user',
        loadComponent: () => import('./add-user/add-user.component').then(m => m.AddUserComponent),
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.SITE_ADMIN]
        },
      },
      {
        path: 'list-user',
        loadComponent: () => import('./list-user/list-user.component').then(m => m.ListUserComponent),
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.SITE_ADMIN]
        },
      },
      {
        path: 'add-policestation',
        loadComponent: () => import('./add-policestation/add-policestation.component').then(m => m.AddPolicestationComponent),
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.SITE_ADMIN]
        },
      },
      {
        path: 'site-admin/edit-policestation/:id',
        loadComponent: () => import('./add-policestation/add-policestation.component').then(m => m.AddPolicestationComponent),
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.SITE_ADMIN]
        },
      },
      {
        path: 'list-policestation',
        loadComponent: () => import('./list-policestation/list-policestation.component').then(m => m.ListPolicestationComponent),
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.SITE_ADMIN]
        },
      },
      {
        path: 'add-licensetype',
        loadComponent: () => import('./add-licensetype/add-licensetype.component').then(m => m.AddLicensetypeComponent),
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.SITE_ADMIN]
        },
      },
      {
        path: 'list-licensetype',
        loadComponent: () => import('./list-licensetype/list-licensetype.component').then(m => m.ListLicensetypeComponent),
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.SITE_ADMIN]
        },
      },
      {
        path: 'add-licensecategory',
        loadComponent: () => import('./add-licensecategory/add-licensecategory.component').then(m => m.AddLicensecategoryComponent),
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.SITE_ADMIN]
        },
      },
      {
        path: 'list-licensecategory',
        loadComponent: () => import('./list-licensecategory/list-licensecategory.component').then(m => m.ListLicensecategoryComponent),
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.SITE_ADMIN]
        },
      },
    ],
  },
];

export default routes;
