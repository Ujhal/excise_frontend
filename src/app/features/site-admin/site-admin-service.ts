import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { District } from '../../core/models/district.model';
import { Dashboard } from '../../core/models/dashboard.model';
import { SubDivision } from '../../core/models/subdivision.model';
import { PoliceStation } from '../../core/models/policestation.model';
import { LicenseType } from '../../core/models/license-type.model';
import { LicenseCategory } from '../../core/models/license-category.model';
import { Account } from '../../core/models/accounts';
import { SalesmanBarman, SalesmanBarmanDocuments } from '../../core/models/salesman-barman.model';
import { CompanyDocuments } from '../../core/models/company.model';

@Injectable({ providedIn: 'root' })
export class SiteAdminService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly mastersUrl = `${this.baseUrl}/masters`;

  constructor(private http: HttpClient) {}

  // --- Utility wrappers ---

  private get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  private post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body);
  }

  private put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body);
  }

  private delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }

  // ========================== DASHBOARD ==========================

  getAdminDashboard(): Observable<Dashboard> {
    return this.get<Dashboard>(`${this.baseUrl}/dashboard`);
  }

  // ========================== USER MANAGEMENT ==========================

  registerUser(user: Account): Observable<any> {
    return this.post(`${this.baseUrl}/user/register/`, user);
  }

  getUsers(): Observable<Account[]> {
    return this.get<Account[]>(`${this.baseUrl}/user/list/`);
  }

  getUserByUsername(username: string): Observable<Account[]> {
    return this.get<Account[]>(`${this.baseUrl}/user/detail/${username}/`);
  }

  updateUser(username: string, changes: Partial<Account>): Observable<Account> {
    return this.put<Account>(`${this.baseUrl}/user/update/${username}/`, changes);
  }

  deleteUser(username: string): Observable<any> {
    return this.delete(`${this.baseUrl}/user/delete/${username}/`);
  }

  // ========================== DISTRICT MANAGEMENT ==========================

  saveDistrict(district: District): Observable<any> {
    return this.post(`${this.mastersUrl}/districts/create/`, district);
  }

  getDistrict(): Observable<District[]> {
    return this.get<District[]>(`${this.mastersUrl}/districts/list`);
  }

  updateDistrict(id: number, changes: Partial<District>): Observable<District> {
    return this.put<District>(`${this.mastersUrl}/districts/update/${id}/`, changes);
  }

  deleteDistrict(id: number): Observable<void> {
    return this.delete(`${this.mastersUrl}/districts/delete/${id}/`);
  }

  // ========================== SUBDIVISION MANAGEMENT ==========================

  saveSubDivision(subdivision: SubDivision): Observable<any> {
    return this.post(`${this.mastersUrl}/subdivisions/create/`, subdivision);
  }

  getSubDivision(): Observable<SubDivision[]> {
    return this.get<SubDivision[]>(`${this.mastersUrl}/subdivisions/list`);
  }

  getSubDivisionByDistrictCode(id: number): Observable<SubDivision[]> {
    return this.get<SubDivision[]>(`${this.mastersUrl}/subdivisions/${id}`);
  }

  updateSubDivision(id: number, changes: Partial<SubDivision>): Observable<SubDivision> {
    return this.put<SubDivision>(`${this.mastersUrl}/subdivisions/update/${id}/`, changes);
  }

  deleteSubdivision(id: number): Observable<any> {
    return this.delete(`${this.mastersUrl}/subdivisions/delete/${id}/`);
  }

  // ========================== POLICE STATION MANAGEMENT ==========================

  addPoliceStation(policeStation: PoliceStation): Observable<any> {
    return this.post(`${this.mastersUrl}/policestations/create/`, policeStation);
  }

  getPoliceStations(): Observable<PoliceStation[]> {
    return this.get<PoliceStation[]>(`${this.mastersUrl}/policestations/list`);
  }

  getPoliceStationBySubDivision(code: number): Observable<PoliceStation[]> {
    return this.get<PoliceStation[]>(`${this.mastersUrl}/subdivision/detail/${code}`);
  }

  updatePolicestation(id: number, changes: Partial<PoliceStation>): Observable<PoliceStation> {
    return this.put<PoliceStation>(`${this.mastersUrl}/policestations/update/${id}/`, changes);
  }

  deletePoliceStation(id: number): Observable<any> {
    return this.delete(`${this.mastersUrl}/policestations/delete/${id}/`);
  }

  // ========================== LICENSE TYPE MANAGEMENT ==========================

  addLicenseType(licenseType: LicenseType): Observable<any> {
    return this.post(`${this.mastersUrl}/licensetypes/create/`, licenseType);
  }

  getLicenseTypes(): Observable<LicenseType[]> {
    return this.get<LicenseType[]>(`${this.mastersUrl}/licensetypes/list/`);
  }

  updateLicenseType(id: number, changes: Partial<LicenseType>): Observable<LicenseType> {
    return this.put<LicenseType>(`${this.mastersUrl}/licensetypes/update/${id}/`, changes);
  }

  deleteLicenseType(id: number): Observable<any> {
    return this.delete(`${this.mastersUrl}/licensetypes/delete/${id}/`);
  }

  // ========================== LICENSE CATEGORY MANAGEMENT ==========================

  addLicenseCategory(category: LicenseCategory): Observable<any> {
    return this.post(`${this.mastersUrl}/licensecategories/create/`, category);
  }

  getLicenseCategories(): Observable<LicenseCategory[]> {
    return this.get<LicenseCategory[]>(`${this.mastersUrl}/licensecategories/list`);
  }

  updateLicenseCategory(id: number, changes: Partial<LicenseCategory>): Observable<LicenseCategory> {
    return this.put<LicenseCategory>(`${this.mastersUrl}/licensecategories/update/${id}/`, changes);
  }

  deleteLicenseCategory(id: number): Observable<any> {
    return this.delete(`${this.mastersUrl}/licensecategories/delete/${id}/`);
  }
}
