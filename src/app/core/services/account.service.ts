import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, catchError, mergeMap, of, shareReplay, tap } from 'rxjs';
import { Account } from '../models/accounts';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = environment.baseUrl;
  
  private userIdentity: Account | null = null;
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account> | null;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  /* login(credentials: { email: string; password: string }): Observable<any> {
    return this.apiService.postLogin(credentials);
  }
 */


  getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/user/list/`, {});
  }

  logout(): Observable<any> {
    return this.apiService.logout().pipe(
      tap(() => {
        // Clear local storage on successful logout
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
  
        // Notify authentication state change
        this.authenticate(null);
      }),
      catchError((error) => {
        console.error("Logout API error:", error);
        return throwError(() => error);
      })
    );
  }  

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  authenticate(identity: Account | null): void {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
    if (!identity) {
      this.accountCache$ = null;
    }
  }

  hasAnyRole(role:  string): boolean {
    if (!this.userIdentity) {
      return false;
    }
    
    return (this.userIdentity.role === role);
  }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.getUserDetails().pipe(
        tap((account: Account) => {
          localStorage.setItem('userName', account.username);
          localStorage.setItem('role', account.role);
          localStorage.setItem('firstName', account.firstName);
          localStorage.setItem('lastName', account.lastName);
          
          this.authenticate(account);
        }),
        shareReplay(),
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null)));
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  changePassword(username: string, old_password: string, new_password: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/change_password/`, { username, old_password, new_password });
  }
}
