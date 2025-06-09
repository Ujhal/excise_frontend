import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  // Flag to prevent multiple refresh requests at once
  private isRefreshing = false;

  // Emits the new access token when available
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, // Check if code is running in browser
    private apiService: ApiService // Service to handle API calls including refresh
  ) {}

  /**
   * Intercepts HTTP requests to attach access token and handle token expiration (401).
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isPlatformBrowser(this.platformId)) {
      let token = localStorage.getItem('access');

      // Attach access token if it exists
      if (token) {
        req = this.addToken(req, token);
      }

      return next.handle(req).pipe(
        catchError(error => {
          // If 401 error, attempt to refresh token
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handle401Error(req, next);
          }
          // If not 401, just propagate the error
          return throwError(() => error);
        })
      );
    }

    // If not running in browser (e.g., server-side rendering), just forward request
    return next.handle(req);
  }

  /**
   * Adds Authorization header with Bearer token to outgoing requests.
   */
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  /**
   * Handles 401 Unauthorized errors by refreshing the access token if possible.
   */
  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = localStorage.getItem('refresh');

      if (!refreshToken) {
        console.error('No refresh token found, logging out.');
        this.logoutAndRedirect();
        return throwError(() => new Error('No refresh token available'));
      }

      // Call API to get new access token using the refresh token
      return this.apiService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          const newAccessToken = token.access;

          if (!newAccessToken) {
            console.error('No new access token received, logging out.');
            this.logoutAndRedirect();
            return throwError(() => new Error('No new access token received'));
          }

          // Store new access token and continue with the original request
          localStorage.setItem('access', newAccessToken);
          this.refreshTokenSubject.next(newAccessToken);

          return next.handle(this.addToken(req, newAccessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          console.error('Refresh token expired or invalid. Logging out.');
          this.logoutAndRedirect();
          return throwError(() => err);
        })
      );
    } else {
      // If a refresh is already in progress, wait until it's done
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(req, token as string));
        })
      );
    }
  }

  /**
   * Clears stored tokens and optionally triggers logout logic.
   */
  private logoutAndRedirect() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    this.apiService.logout(); // Optionally call backend logout endpoint
  }
}