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
    return this.http.get<Account[]>(`${this.baseUrl}/api/register`);
  }

  //district
  saveDistrict(district: District): Observable<any> {
    return this.http.post(`${this.apiUrl}/district-create/`, district);
  }
  getDistrict(): Observable<District[]> {
    return this.http.get<District[]>(`${this.apiUrl}/districts-get-all/`);
  }
  updateDistrict(id: number, changes: Partial<SubDivision>): Observable<District> {
    return this.http.put<District>(`${this.apiUrl}/district-update/${id}`, changes);
  }
  deleteDistrict(id: number) {
    return this.http.delete(`your-api-url/subdivisions/${id}`);
  }

  //sub division
  saveSubDivision(subdivision: SubDivision): Observable<any> {
    return this.http.post(`${this.apiUrl}/subdivision-create`, subdivision);
  }
  getSubDivision(): Observable<SubDivision[]> {
    return this.http.get<SubDivision[]>(`${this.baseUrl}/api/subdivision/view`);
  }
  getSubDivisionByDistrictCode(districtCode: number): Observable<SubDivision[]> {
    return this.http.get<SubDivision[]>(`${this.apiUrl}/subdivision-get-one/${districtCode}`);
  } 
  updateSubDivision(id: number, changes: Partial<SubDivision>): Observable<SubDivision> {
    return this.http.put<SubDivision>(`${this.apiUrl}/subdivision-update/${id}`, changes);
  }
  deleteSubdivision(id: number) {
    return this.http.delete(`${this.apiUrl}/subdivisions-delete/${id}`);
  }

  //police station
  addPoliceStation(policeStation: PoliceStation) {
    return this.http.post(`${this.apiUrl}/policestation-create`, policeStation);
  }
  getPoliceStations() {
    return this.http.get<PoliceStation[]>(`${this.apiUrl}/policestations-get-all`);
  }
  deletePoliceStation(id: number) {
    return this.http.delete(`${this.apiUrl}/policestation-delete/${id}/`);
  }

  //license type
  addLicenseType(licenseType: LicenseType): Observable<any> {
    return this.http.post(`${this.apiUrl}/license-type`, licenseType);
  }
  getLicenseTypes(): Observable<LicenseType[]> {
    return this.http.get<LicenseType[]>(`${this.apiUrl}/license-type`);
  }
  deleteLicenseType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/license-types/${id}/`);
  }

  //license category
  addLicenseCategory(category: LicenseCategory): Observable<any> {
    return this.http.post(`${this.apiUrl}/license-categories`, category);
  }
  getLicenseCategories(): Observable<LicenseCategory[]> {
    return this.http.get<LicenseCategory[]>(`${this.apiUrl}/license-categories-get-all`);
  } 
  deleteLicenseCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/license-categories/${id}/`);
  }  
}

/* 
  // Dashboard
  getAdminDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.baseUrl}/api/dashboard`, {});
  }

  // User
  saveUser(user: Account): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/register`, user);
  }
  getUsers(): Observable<any> {
    return this.http.get<Account[]>(`${this.baseUrl}/api/register`);
  }

  // District
  saveDistrict(district: District): Observable<any> {
    return this.http.post(`${this.apiUrl}/district-create/`, district);
  }
  getDistrict(): Observable<District[]> {
    return this.http.get<District[]>(`${this.apiUrl}/districts-get-all/`);
  }
  getDistrictById(id: number): Observable<District> {
    return this.http.get<District>(`${this.apiUrl}/district-get-one/${id}/`);
  }
  updateDistrict(id: number, changes: Partial<District>): Observable<District> {
    return this.http.put<District>(`${this.apiUrl}/district-update/${id}/`, changes);
  }

  // Subdivision
  saveSubDivision(subdivision: SubDivision): Observable<any> {
    return this.http.post(`${this.apiUrl}/subdivision-create/`, subdivision);
  }
  getSubDivisionById(id: number): Observable<SubDivision> {
    return this.http.get<SubDivision>(`${this.apiUrl}/subdivision-get-one/${id}/`);
  }
  updateSubDivision(id: number, changes: Partial<SubDivision>): Observable<SubDivision> {
    return this.http.put<SubDivision>(`${this.apiUrl}/subdivision-update/${id}/`, changes);
  }
  deleteSubdivision(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/subdivision-delete/${id}/`);
  }

  // Police Station
  addPoliceStation(policeStation: PoliceStation): Observable<any> {
    return this.http.post(`${this.apiUrl}/policestation-create/`, policeStation);
  }
  getPoliceStations(): Observable<PoliceStation[]> {
    return this.http.get<PoliceStation[]>(`${this.apiUrl}/policestations-get-all/`);
  }
  getPoliceStationById(id: number): Observable<PoliceStation> {
    return this.http.get<PoliceStation>(`${this.apiUrl}/policestation-get-one/${id}/`);
  }
  updatePoliceStation(id: number, changes: Partial<PoliceStation>): Observable<PoliceStation> {
    return this.http.put<PoliceStation>(`${this.apiUrl}/policestation-update/${id}/`, changes);
  }

  // License Type
  addLicenseType(licenseType: LicenseType): Observable<any> {
    return this.http.post(`${this.apiUrl}/license-type-get-all/`, licenseType);
  }
  getLicenseTypes(): Observable<LicenseType[]> {
    return this.http.get<LicenseType[]>(`${this.apiUrl}/license-type-get-all/`);
  }
  getLicenseTypeById(id: number): Observable<LicenseType> {
    return this.http.get<LicenseType>(`${this.apiUrl}/license-type-get-one/${id}/`);
  }
  updateLicenseType(id: number, changes: Partial<LicenseType>): Observable<LicenseType> {
    return this.http.put<LicenseType>(`${this.apiUrl}/license-type-update/${id}/`, changes);
  }
  deleteLicenseType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/license-type-delete/${id}/`);
  }

  // License Category
  addLicenseCategory(category: LicenseCategory): Observable<any> {
    return this.http.post(`${this.apiUrl}/license-categories-get-all/`, category);
  }
  getLicenseCategories(): Observable<LicenseCategory[]> {
    return this.http.get<LicenseCategory[]>(`${this.apiUrl}/license-categories-get-all/`);
  }
  getLicenseCategoryById(id: number): Observable<LicenseCategory> {
    return this.http.get<LicenseCategory>(`${this.apiUrl}/license-categories-get-one/${id}/`);
  }
*/