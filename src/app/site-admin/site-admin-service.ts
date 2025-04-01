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
  registerUser(user: Account): Observable<any> {
    console.log("Registering user:", user); // Debugging step
    return this.http.post(`${this.baseUrl}/api/user/register/`, user);
  }
  
  getUsers(): Observable<any> {
    return this.http.get<Account[]>(`${this.baseUrl}/api/user/list/`);
  }
  getUserByUsername(username: string): Observable<any> {
    return this.http.get<Account[]>(`${this.baseUrl}/api/user/detail/${username}/`);
  }
  updateUser(username: string): Observable<any> {
    return this.http.get<Account[]>(`${this.baseUrl}/api/user/update/${username}/`);
  }
  deleteUser(username: string): Observable<any> {
    return this.http.get<Account[]>(`${this.baseUrl}/api/user/delete/${username}/`);
  }

  //district
  saveDistrict(district: District): Observable<any> {
    return this.http.post(`${this.apiUrl}/districts/create/`, district);
  }
  getDistrict(): Observable<District[]> {
    return this.http.get<District[]>(`${this.apiUrl}/districts/list`);
  }
  updateDistrict(id: number, changes: Partial<District>): Observable<District> {
    return this.http.put<District>(`${this.apiUrl}/districts/update/${id}/`, changes);
  }  
  deleteDistrict(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/districts/delete/${id}/`);
  }

  //sub division
  saveSubDivision(subdivision: SubDivision): Observable<any> {
    return this.http.post(`${this.apiUrl}/subdivisions/create/`, subdivision);
  }
  getSubDivision(): Observable<SubDivision[]> {
    return this.http.get<SubDivision[]>(`${this.apiUrl}/subdivisions/list`);
  }
  getSubDivisionByDistrictCode(id: number): Observable<SubDivision[]> {
    return this.http.get<SubDivision[]>(`/api/subdivisions/${id}`);
  }
  updateSubDivision(id: number, changes: Partial<SubDivision>): Observable<SubDivision> {
    return this.http.put<SubDivision>(`${this.apiUrl}/subdivisions/update/${id}/`, changes);
  }
  deleteSubdivision(id: number) {
    return this.http.delete(`${this.apiUrl}/subdivisions/delete/${id}/`);
  }

  //police station
  addPoliceStation(policeStation: PoliceStation) {
    return this.http.post(`${this.apiUrl}/policestations/create/`, policeStation);
  }
  getPoliceStations() {
    return this.http.get<PoliceStation[]>(`${this.apiUrl}/policestations/list`);
  }
  getPoliceStationBySubDivision(SubDivisionCode: number): Observable<PoliceStation[]> {
    return this.http.get<PoliceStation[]>(`${this.apiUrl}/subdivision/detail/${SubDivisionCode}`);
  }
  updatePolicestation(id: number, changes: Partial<PoliceStation>): Observable<PoliceStation> {
    return this.http.put<PoliceStation>(`${this.apiUrl}/policestations/update/${id}/`, changes);
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
  updateLicenseType(id: number, changes: Partial<LicenseType>): Observable<LicenseType> {
    return this.http.put<LicenseType>(`${this.apiUrl}/licensetypes/delete/${id}/`, changes);
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
  updateLicenseCategory(id: number, changes: Partial<LicenseCategory>): Observable<LicenseCategory> {
    return this.http.put<LicenseCategory>(`${this.apiUrl}/licensecategories/update/${id}/`, changes);
  }
  deleteLicenseCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/licensecategories/delete/${id}/`);
  }  

  // Salesman Barman
  getSalesmanBarmanList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/salesmanbarman/list/`);
  }
  createSalesmanBarman(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/salesmanbarman/create/`, data);
  }
  getSalesmanBarmanDetail(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/salesmanbarman/detail/${id}/`);
  }
  updateSalesmanBarman(id: number, changes: Partial<any>): Observable<any> {
    return this.http.put(`${this.apiUrl}/salesmanbarman/update/${id}/`, changes);
  }
  deleteSalesmanBarman(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/salesmanbarman/delete/${id}/`);
  }
  // Salesman Barman Documents
  getSalesmanBarmanDocuments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/salesmanbarman/document/list/`);
  }
  createSalesmanBarmanDocument(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/salesmanbarman/document/create/`, data);
  }
  getSalesmanBarmanDocumentDetail(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/salesmanbarman/document/detail/${id}/`);
  }
  updateSalesmanBarmanDocument(id: number, changes: Partial<any>): Observable<any> {
    return this.http.put(`${this.apiUrl}/salesmanbarman/document/update/${id}/`, changes);
  }
  deleteSalesmanBarmanDocument(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/salesmanbarman/document/delete/${id}/`);
  }

  // Company
  getCompanies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/companies/list/`);
  }
  createCompany(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/companies/create/`, data);
  }
  getCompanyDetail(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/companies/detail/${id}/`);
  }
  updateCompany(id: number, changes: Partial<any>): Observable<any> {
    return this.http.put(`${this.apiUrl}/companies/update/${id}/`, changes);
  }
  deleteCompany(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/companies/delete/${id}/`);
  }
  getDocuments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/documents/list/`);
  }

  //Documents
  createDocument(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/documents/create/`, data);
  }
  getDocumentDetail(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/documents/detail/${id}/`);
  }
  updateDocument(id: number, changes: Partial<any>): Observable<any> {
    return this.http.put(`${this.apiUrl}/documents/update/${id}/`, changes);
  }
  deleteDocument(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/documents/delete/${id}/`);
  }
}
