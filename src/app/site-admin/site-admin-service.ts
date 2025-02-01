import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { District } from '../shared/models/district.model';
import { Dashboard } from '../shared/models/dashboard.model';
import { SubDivision } from '../shared/models/subdivision.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteAdminService {
  private baseUrl = environment.baseUrl;
  private apiUrl = `${this.baseUrl}/api`
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
    return this.http.get<SubDivision[]>(`${this.apiUrl}/subdivision/`);
  }
  updateSubDivision(id: number, changes: Partial<SubDivision>): Observable<SubDivision> {
    return this.http.put<SubDivision>(`${this.apiUrl}/subdivision/${id}/`, changes);
  }

  getAdminDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.apiUrl}/dashboard/`,{});
  }
}