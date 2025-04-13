import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { District } from '../../core/models/district.model'; // Importing model for District
import { Dashboard } from '../../core/models/dashboard.model'; // Importing model for Dashboard
import { SubDivision } from '../../core/models/subdivision.model'; // Importing model for SubDivision
import { PoliceStation } from '../../core/models/policestation.model'; // Importing model for PoliceStation
import { LicenseType } from '../../core/models/license-type.model'; // Importing model for LicenseType
import { LicenseCategory } from '../../core/models/license-category.model'; // Importing model for LicenseCategory
import { environment } from '../../../environments/environment'; // Import environment for API base URL
import { Account } from '../../core/models/accounts'; // Importing model for Account
import { SalesmanBarman, SalesmanBarmanDocuments } from '../../core/models/salesman-barman.model'; // Importing models for SalesmanBarman and SalesmanBarmanDocuments
import { Observable } from 'rxjs'; // Importing Observable for HTTP requests

@Injectable({ providedIn: 'root' })
export class SiteAdminService {
  private baseUrl = environment.baseUrl; // Base URL for the API
  private apiUrl = `${this.baseUrl}/masters`; // API URL for master data (district, subdivisions, etc.)

  constructor(private http: HttpClient) {}

  // Dashboard
  getAdminDashboard(): Observable<Dashboard> {
    // Fetches the dashboard data
    return this.http.get<Dashboard>(`${this.baseUrl}/api/dashboard`, {});
  }

  // User Management
  registerUser(user: Account): Observable<any> {
    // Registers a new user
    console.log("Registering user:", user); // Debugging step
    return this.http.post(`${this.baseUrl}/api/user/register/`, user);
  }
  
  getUsers(): Observable<any> {
    // Fetches the list of all users
    return this.http.get<Account[]>(`${this.baseUrl}/api/user/list/`);
  }
  
  getUserByUsername(username: string): Observable<any> {
    // Fetches a user by their username
    return this.http.get<Account[]>(`${this.baseUrl}/api/user/detail/${username}/`);
  }
  
  updateUser(username: string): Observable<any> {
    // Updates user details based on the username
    return this.http.get<Account[]>(`${this.baseUrl}/api/user/update/${username}/`);
  }
  
  deleteUser(username: string): Observable<any> {
    // Deletes a user based on the username
    return this.http.get<Account[]>(`${this.baseUrl}/api/user/delete/${username}/`);
  }

  // District Management
  saveDistrict(district: District): Observable<any> {
    // Saves a new district
    return this.http.post(`${this.apiUrl}/districts/create/`, district);
  }

  getDistrict(): Observable<District[]> {
    // Fetches a list of all districts
    return this.http.get<District[]>(`${this.apiUrl}/districts/list`);
  }

  updateDistrict(id: number, changes: Partial<District>): Observable<District> {
    // Updates the details of a specific district
    return this.http.put<District>(`${this.apiUrl}/districts/update/${id}/`, changes);
  }

  deleteDistrict(id: number): Observable<void> {
    // Deletes a district by its ID
    return this.http.delete<void>(`${this.apiUrl}/districts/delete/${id}/`);
  }

  // Sub Division Management
  saveSubDivision(subdivision: SubDivision): Observable<any> {
    // Saves a new subdivision
    return this.http.post(`${this.apiUrl}/subdivisions/create/`, subdivision);
  }

  getSubDivision(): Observable<SubDivision[]> {
    // Fetches a list of all subdivisions
    return this.http.get<SubDivision[]>(`${this.apiUrl}/subdivisions/list`);
  }

  getSubDivisionByDistrictCode(id: number): Observable<SubDivision[]> {
    // Fetches subdivisions based on the district code
    return this.http.get<SubDivision[]>(`/api/subdivisions/${id}`);
  }

  updateSubDivision(id: number, changes: Partial<SubDivision>): Observable<SubDivision> {
    // Updates the details of a specific subdivision
    return this.http.put<SubDivision>(`${this.apiUrl}/subdivisions/update/${id}/`, changes);
  }

  deleteSubdivision(id: number) {
    // Deletes a subdivision by its ID
    return this.http.delete(`${this.apiUrl}/subdivisions/delete/${id}/`);
  }

  // Police Station Management
  addPoliceStation(policeStation: PoliceStation) {
    // Adds a new police station
    return this.http.post(`${this.apiUrl}/policestations/create/`, policeStation);
  }

  getPoliceStations() {
    // Fetches a list of all police stations
    return this.http.get<PoliceStation[]>(`${this.apiUrl}/policestations/list`);
  }

  getPoliceStationBySubDivision(SubDivisionCode: number): Observable<PoliceStation[]> {
    // Fetches police stations based on subdivision code
    return this.http.get<PoliceStation[]>(`${this.apiUrl}/subdivision/detail/${SubDivisionCode}`);
  }

  updatePolicestation(id: number, changes: Partial<PoliceStation>): Observable<PoliceStation> {
    // Updates the details of a specific police station
    return this.http.put<PoliceStation>(`${this.apiUrl}/policestations/update/${id}/`, changes);
  }

  deletePoliceStation(id: number) {
    // Deletes a police station by its ID
    return this.http.delete(`${this.apiUrl}/policestations/delete/${id}/`);
  }

  // License Type Management
  addLicenseType(licenseType: LicenseType): Observable<any> {
    // Adds a new license type
    return this.http.post(`${this.apiUrl}/licensetypes/create/`, licenseType);
  }

  getLicenseTypes(): Observable<LicenseType[]> {
    // Fetches a list of all license types
    return this.http.get<LicenseType[]>(`${this.apiUrl}/licensetypes/list/`);
  }

  updateLicenseType(id: number, changes: Partial<LicenseType>): Observable<LicenseType> {
    // Updates the details of a specific license type
    return this.http.put<LicenseType>(`${this.apiUrl}/licensetypes/delete/${id}/`, changes);
  }

  deleteLicenseType(id: number): Observable<any> {
    // Deletes a license type by its ID
    return this.http.delete(`${this.apiUrl}/licensetypes/delete/${id}/`);
  }

  // License Category Management
  addLicenseCategory(category: LicenseCategory): Observable<any> {
    // Adds a new license category
    return this.http.post(`${this.apiUrl}/licensecategories/create/`, category);
  }

  getLicenseCategories(): Observable<LicenseCategory[]> {
    // Fetches a list of all license categories
    return this.http.get<LicenseCategory[]>(`${this.apiUrl}/licensecategories/list`);
  }

  updateLicenseCategory(id: number, changes: Partial<LicenseCategory>): Observable<LicenseCategory> {
    // Updates the details of a specific license category
    return this.http.put<LicenseCategory>(`${this.apiUrl}/licensecategories/update/${id}/`, changes);
  }

  deleteLicenseCategory(id: number): Observable<any> {
    // Deletes a license category by its ID
    return this.http.delete(`${this.apiUrl}/licensecategories/delete/${id}/`);
  }

  // Salesman Barman Management
  getSalesmanBarmanList(): Observable<any> {
    // Fetches a list of all SalesmanBarman records
    return this.http.get(`${this.apiUrl}/salesmanbarman/list/`);
  }

  createSalesmanBarman(data: any): Observable<any> {
    // Creates a new SalesmanBarman record
    return this.http.post(`${this.apiUrl}/salesmanbarman/create/`, data);
  }

  getSalesmanBarmanDetail(id: number): Observable<any> {
    // Fetches the details of a specific SalesmanBarman record
    return this.http.get(`${this.apiUrl}/salesmanbarman/detail/${id}/`);
  }

  // Company Management
  getCompanyList(): Observable<any> {
    // Fetches a list of all companies
    return this.http.get(`${this.apiUrl}/company/list/`);
  }

  createCompany(data: any): Observable<any> {
    // Creates a new company
    return this.http.post(`${this.apiUrl}/company/create/`, data);
  }

  getCompanyDetail(id: number): Observable<any> {
    // Fetches the details of a specific company
    return this.http.get(`${this.apiUrl}/company/detail/${id}/`);
  }

  // File Upload Test
  uploadedFiles: Record<string, File> = {}; // Record of uploaded files by their key

  setUploadedFile(key: string, file: File) {
    // Sets an uploaded file by a key
    this.uploadedFiles[key] = file;
  }

  getUploadedFile(key: string): File | undefined {
    // Retrieves an uploaded file by its key
    return this.uploadedFiles[key];
  }

  getAllUploadedFiles(): Partial<Record<keyof SalesmanBarmanDocuments, File>> {
    // Retrieves all uploaded files
    return this.uploadedFiles;
  }
}
