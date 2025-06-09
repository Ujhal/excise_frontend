  import { inject, isDevMode } from '@angular/core';
  import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
  import { map } from 'rxjs/operators';
  import { AccountService } from '../services/account.service';
  import { StateStorageService } from './state-storage.service';

  /**
   * Route guard to control access based on user authentication and role/authority.
   * It verifies if the user is logged in and has required permissions before allowing route activation.
   */
  export const UserRouteAccessService: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    // Inject required services
    const accountService = inject(AccountService);
    const router = inject(Router);
    const stateStorageService = inject(StateStorageService);

    // Attempt to get the current user's account
    return accountService.identity().pipe(
      map(account => {
        if (account) {
          // Get the list of required authorities from route data
          const authorities = next.data['authorities'];

          // Allow access if no authorities are required or if user has the required role
          if (!authorities || authorities.length === 0 || accountService.hasAnyRole(authorities)
          ) {
            return true;
          }

          // If in development mode, log an error when user lacks permission
          if (isDevMode()) {
            console.error('User does not have any of the required authorities: ', authorities);
          }

          // Redirect to access denied page if user lacks required role
          router.navigate(['accessdenied']);
          return false;
        }

        // If user is not logged in, store the attempted URL and redirect to login page
        stateStorageService.storeUrl(state.url);
        router.navigate(['/login']);
        return false;
      }),
    );
  };
