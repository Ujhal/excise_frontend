import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { District } from '../shared/models/district.model';
import { Dashboard } from '../shared/models/dashboard.model';
import { SubDivision } from '../shared/models/subdivision.model';
import { PoliceStation } from '../shared/models/policestation.model';
import { LicenseType } from '../shared/models/license-type.model';
import { LicenseCategory } from '../shared/models/license-category.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Account } from '../shared/models/accounts';

@Injectable({ providedIn: 'root' })
export class SiteAdminService {
  private baseUrl = environment.baseUrl;
  private apiUrl = `${this.baseUrl}/masters`

  constructor(private http: HttpClient) {}
  
  //dashboard
  getAdminDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.baseUrl}/api/dashboard`,{});
  }

  //user
  saveUser(user: Account): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/register`, user);
  }
  getUsers(): Observable<any> {
    return this.http.get<Account[]>(`${this.baseUrl}/api/users`);
  }

  //district CRUD
  saveDistrict(district: District): Observable<any> {
    return this.http.post(`${this.apiUrl}/districts/create/`, district);
  }
  getDistrict(): Observable<District[]> {
    return this.http.get<District[]>(`${this.apiUrl}/districts/list`);
  }
  updateDistrict(id: number, changes: Partial<SubDivision>): Observable<District> {
    return this.http.put<District>(`${this.apiUrl}/districts/update/${id}`, changes);
  }
  deleteDistrict(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/districts/delete/${id}`);
  }

  //sub division
  saveSubDivision(subdivision: SubDivision): Observable<any> {
    return this.http.post(`${this.apiUrl}/subdivisions/create/`, subdivision);
  }
  getSubDivision(): Observable<SubDivision[]> {
    return this.http.get<SubDivision[]>(`${this.apiUrl}/subdivisions/list`);
  }
  getSubDivisionByDistrictCode(districtCode: number): Observable<SubDivision[]> {
    return this.http.get<SubDivision[]>(`${this.apiUrl}/subdivision/detail/${districtCode}`);
  } 
  updateSubDivision(id: number, changes: Partial<SubDivision>): Observable<SubDivision> {
    return this.http.put<SubDivision>(`${this.apiUrl}/subdivisions/update/${id}`, changes);
  }
  deleteSubdivision(id: number) {
    return this.http.delete(`${this.apiUrl}/subdivisions/delete/${id}`);
  }

  //police station
  addPoliceStation(policeStation: PoliceStation) {
    return this.http.post(`${this.apiUrl}/policestations/create`, policeStation);
  }
  getPoliceStations() {
    return this.http.get<PoliceStation[]>(`${this.apiUrl}/policestations/list`);
  }
  getPoliceStationBySubDivision(SubDivisionCode: number): Observable<PoliceStation[]> {
    return this.http.get<PoliceStation[]>(`${this.apiUrl}/subdivision/detail/${SubDivisionCode}`);
  }
  updatePolicestation(id: number, changes: Partial<PoliceStation>): Observable<PoliceStation> {
    return this.http.put<PoliceStation>(`${this.apiUrl}/policestations/update/${id}`, changes);
  }
  deletePoliceStation(id: number) {
    return this.http.delete(`${this.apiUrl}/policestations/delete/${id}/`);
  }

  //license type
  addLicenseType(licenseType: LicenseType): Observable<any> {
    return this.http.post(`${this.apiUrl}/licensetypes/create/`, licenseType);
  }
  getLicenseTypes(): Observable<LicenseType[]> {
    return this.http.get<LicenseType[]>(`${this.apiUrl}/licensetypes/list/`);
  }
  deleteLicenseType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/licensetypes/delete/${id}/`);
  }

  //license category
  addLicenseCategory(category: LicenseCategory): Observable<any> {
    return this.http.post(`${this.apiUrl}/licensecategories/create/`, category);
  }
  getLicenseCategories(): Observable<LicenseCategory[]> {
    return this.http.get<LicenseCategory[]>(`${this.apiUrl}/licensecategories/list`);
  } 
  deleteLicenseCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/licensecategories/delete/${id}/`);
  }  
}
