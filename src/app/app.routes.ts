import { Routes } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { LoginComponent } from './login/login.component';
import { Authority } from './config/authority.constants';
import { UserRouteAccessService } from './config/user-route-access.service';
import { LicenseeDashboardComponent } from './licensee/licensee-dashboard/licensee-dashboard.component';
import { SelectLicenseComponent } from './licensee/licensee-dashboard/apply-license/stepper/select-license/select-license.component';
import { KeyInfoComponent } from './licensee/licensee-dashboard/apply-license/stepper/key-info/key-info.component';
import { AddressComponent } from './licensee/licensee-dashboard/apply-license/stepper/address/address.component';
import { UnitDetailsComponent } from './licensee/licensee-dashboard/apply-license/stepper/unit-details/unit-details.component';
import { MemberDetailsComponent } from './licensee/licensee-dashboard/apply-license/stepper/member-details/member-details.component';
import { LicenseComponent } from './licensee/licensee-dashboard/apply-license/stepper/license/license.component';
import { ApplyLicenseComponent } from './licensee/licensee-dashboard/apply-license/apply-license.component';

import { LinkComponent } from './layouts/footer/link/link.component';
import { MainLinksComponent } from './layouts/main/main-links/main-links.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: { showCarousel: true },
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  { path: 'footer/:page', component: LinkComponent },
  { path: 'main/:page', component: MainLinksComponent },
  
  {
    path: 'site-admin',
    data: {
      authorities: [Authority.SITE_ADMIN],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./site-admin/site-admin-routes'),
  },

  {
    path: 'licensee',
    loadChildren: () => import('./licensee/licensee.routes').then((m) => m.licenseeRoutes),
  },

  {
    path: 'licensee-dashboard',
    component: LicenseeDashboardComponent,
    
  },

  { 
    path: 'licensee-dashboard/apply-license', 
    component: ApplyLicenseComponent,
    children: [
      { path: 'selectLicense', component: SelectLicenseComponent },
      { path: 'keyInfo', component: KeyInfoComponent },
      { path: 'address', component: AddressComponent },
      { path: 'unitDetails', component: UnitDetailsComponent },
      { path: 'memberDetails', component: MemberDetailsComponent },
      { path: 'license', component: LicenseComponent },
      { path: '**', redirectTo: 'select-license', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'licensee-dashboard', pathMatch: 'full' }
];



export default routes;