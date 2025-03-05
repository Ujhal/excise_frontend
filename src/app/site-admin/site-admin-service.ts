import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { District } from '../shared/models/district.model';
import { Dashboard } from '../shared/models/dashboard.model';
import { SubDivision } from '../shared/models/subdivision.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Account } from '../shared/models/accounts';

@Injectable({ providedIn: 'root' })
export class SiteAdminService {
  private baseUrl = environment.baseUrl;
  private apiUrl = `${this.baseUrl}/api`
  private masterUrl = `${this.baseUrl}/masters`
  constructor(private http: HttpClient) {}


  saveDistrict(district: District): Observable<any> {
    return this.http.post(`${this.apiUrl}/district/`, district);
  }
  getDistrict(): Observable<District[]> {
    return this.http.get<District[]>(`${this.apiUrl}/district/view/`);
  }
  updateDistrict(id: number, changes: Partial<SubDivision>): Observable<District> {
    return this.http.put<District>(`${this.apiUrl}/district/${id}/`, changes);
  }

  saveSubDivision(subdivision: SubDivision): Observable<any> {
    return this.http.post(`${this.apiUrl}/subdivision/`, subdivision);
  }
  getSubDivision(): Observable<SubDivision[]> {
    return this.http.get<SubDivision[]>(`${this.apiUrl}/subdivision/view`);
  }
  getSubDivisionByDistrictCode(districtCode: number): Observable<SubDivision[]> {
    return this.http.get<SubDivision[]>(`${this.apiUrl}/subdivision/by-district-code/${districtCode}/`);
  }
  
  updateSubDivision(id: number, changes: Partial<SubDivision>): Observable<SubDivision> {
    return this.http.put<SubDivision>(`${this.apiUrl}/subdivision/${id}/`, changes);
  }

  saveUser(user: Account): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, user);
  }
  getUsers(): Observable<any> {
    return this.http.get<Account[]>(`${this.apiUrl}/users/`);
  }

  getAdminDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.apiUrl}/dashboard/`,{});
  }
}