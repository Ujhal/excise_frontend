import { Routes } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { LoginComponent } from './login/login.component';
import { Authority } from './config/authority.constants';
import { UserRouteAccessService } from './config/user-route-access.service';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
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
];

export default routes;