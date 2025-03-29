import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.baseUrl;
  private apiUrl = `${this.baseUrl}/api`;

  constructor(private http: HttpClient) {}

  // Get CAPTCHA
  getCaptcha(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_captcha/`).pipe(
      catchError((error) => {
        console.error('Error fetching CAPTCHA:', error);
        return throwError(() => error);
      })
    );
  }

  // Login API
  login(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/user/login/`, data, { headers }).pipe(
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  // Logout API
  logout(): Observable<any> {
    const refresh = localStorage.getItem('refresh');
    const access = localStorage.getItem('access');
  
    if (!refresh || !access) {
      console.error("No token found for logout.");
      return throwError(() => new Error("No token found"));
    }
  
    const headers = {
      'Authorization': `Bearer ${access}`, // Send access token
      'Content-Type': 'application/json'
    };
  
    return this.http.post(`${this.apiUrl}/user/logout/`, { refresh }, { headers }).pipe(
      catchError((error) => {
        console.error('Logout failed:', error);
        return throwError(() => error);
      })
    );
  }
  
  

  // Refresh Token API (with Fix)
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh');

    if (!refreshToken) {
      console.error('Refresh token is missing!');
      return throwError(() => new Error('Refresh token missing'));
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/token/refresh/`, { refresh: refreshToken }, { headers }).pipe(
      catchError((error) => {
        console.error('Token refresh failed:', error);
        return throwError(() => error);
      })
    );
  }

  // Get Chart Data
  getChart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/count/`).pipe(
      catchError((error) => {
        console.error('Error fetching chart data:', error);
        return throwError(() => error);
      })
    );
  }
}
