import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
  })
  export class ApiService {
    private baseUrl = environment.baseUrl;
    private apiUrl = `${this.baseUrl}/api`
    constructor(private http: HttpClient) {}
  
    getCaptcha(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/get_captcha/`);
    }
  
    login(data: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/login/`, data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });
    }
    logout(): Observable<any> {
      return this.http.post(`${this.apiUrl}/logout`, {});
    }
    refreshToken(): Observable<any> {
      const refreshToken = localStorage.getItem('refresh');
      return this.http.post(`${this.apiUrl}/token/refresh/`, {refresh: refreshToken})
    }
    getChart(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/count/`)
    }
    
  }