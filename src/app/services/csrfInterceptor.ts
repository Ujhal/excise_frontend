import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { ApiService } from './api.service';

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
      const token = localStorage.getItem('access');
      
      if (token) {
        const cloned = this.addToken(req, token);
        return next.handle(cloned).pipe(
          catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              return this.handle401Error(req, next);
            }
            return throwError(() => error);
          })
        );
      }
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

      return this.apiService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          const newAccessToken = token.access;
          const newRefreshToken = token.refresh;
          localStorage.setItem('access', newAccessToken);
          localStorage.setItem('refresh', newRefreshToken);
          this.refreshTokenSubject.next(newAccessToken);

          return next.handle(this.addToken(req, newAccessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.apiService.logout(); // Clear tokens and redirect to login
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
};