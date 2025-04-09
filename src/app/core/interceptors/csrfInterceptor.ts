import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isPlatformBrowser(this.platformId)) {
      let token = localStorage.getItem('access');

      if (token) {
        req = this.addToken(req, token);
      }

      return next.handle(req).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handle401Error(req, next);
          }
          return throwError(() => error);
        })
      );
    }
    return next.handle(req);
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

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

      return this.apiService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          const newAccessToken = token.access;

          if (!newAccessToken) {
            console.error('No new access token received, logging out.');
            this.logoutAndRedirect();
            return throwError(() => new Error('No new access token received'));
          }

          // Store new access token (but keep the existing refresh token)
          localStorage.setItem('access', newAccessToken);
          this.refreshTokenSubject.next(newAccessToken);

          return next.handle(this.addToken(req, newAccessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          console.error("Refresh token expired or invalid. Logging out.");
          this.logoutAndRedirect();
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(req, token as string));
        })
      );
    }
  }

  private logoutAndRedirect() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    this.apiService.logout(); // Call logout API if necessary
  }
}
