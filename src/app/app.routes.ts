import { Routes } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { LoginComponent } from './login/login.component';
import { Authority } from './config/authority.constants';
import { UserRouteAccessService } from './config/user-route-access.service';
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
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];



export default routes;