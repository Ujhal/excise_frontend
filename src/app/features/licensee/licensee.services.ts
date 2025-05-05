import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dashboard } from '../../core/models/dashboard.model';
import { District } from '../../core/models/district.model';
import { SubDivision } from '../../core/models/subdivision.model';
import { PoliceStation } from '../../core/models/policestation.model';
import { LicenseType } from '../../core/models/license-type.model';
import { LicenseCategory } from '../../core/models/license-category.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { LicenseApplication, LicenseApplicationDocuments } from '../../core/models/license-application.model';
import { SalesmanBarmanDocuments } from '../../core/models/salesman-barman.model';
import { CompanyDocuments } from '../../core/models/company.model';

@Injectable({ providedIn: 'root' })
export class LicenseeService {
  private readonly baseUrl = environment.apiBaseUrl; // Base URL for the API
  private readonly mastersUrl = `${this.baseUrl}/masters`; // API URL for master data (district, subdivisions, etc.)

  // Stores uploaded files for the License Application form, mapped by document field keys
  private licenseApplicationDocuments: Partial<Record<keyof LicenseApplicationDocuments, File>> = {};

  // Stores uploaded files for the Salesman/Barman form, mapped by document field keys
  private salesmanBarmanDocs: Partial<Record<keyof SalesmanBarmanDocuments, File>> = {};

  // Stores uploaded files for the Company registration form, mapped by document field keys
  private companyDocs: Partial<Record<keyof CompanyDocuments, File>> = {};

  constructor(private http: HttpClient) {}

  // ========================== MASTER DATA ==========================
  
  // Fetch list of districts
  getDistrict(): Observable<District[]> {
    return this.http.get<District[]>(`${this.mastersUrl}/districts/list`);
  }

  // Fetch list of subdivisions
  getSubDivision(): Observable<SubDivision[]> {
    return this.http.get<SubDivision[]>(`${this.mastersUrl}/subdivisions/list`);
  }

  // Fetch list of police stations
  getPoliceStations(): Observable<PoliceStation[]> {
    return this.http.get<PoliceStation[]>(`${this.mastersUrl}/policestations/list`);
  }

  // Fetch list of license types
  getLicenseTypes(): Observable<LicenseType[]> {
    return this.http.get<LicenseType[]>(`${this.mastersUrl}/licensetypes/list/`);
  }

  // Fetch list of license categories
  getLicenseCategories(): Observable<LicenseCategory[]> {
    return this.http.get<LicenseCategory[]>(`${this.mastersUrl}/licensecategories/list/`);
  } 

  // ========================== LICENSE APPLICATION ==========================
  
  submitLicenseApplication(data: any): Observable<any> {
    return this.http.post<LicenseApplication[]>(`${this.baseUrl}/licenseapplication/apply/`, data);
  } 

  setLicenseApplicationDocuments(docs: Partial<Record<keyof LicenseApplicationDocuments, File>>) {
    this.licenseApplicationDocuments = { ...this.licenseApplicationDocuments, ...docs };
  }

  getLicenseApplicationDocuments(): Partial<Record<keyof LicenseApplicationDocuments, File>> {
    return this.licenseApplicationDocuments;
  }

  clearLicenseApplicationDocuments(): void {
    this.licenseApplicationDocuments = {};
  }

  // ========================== SALESMAN / BARMAN REGISTRATION ==========================

  getSalesmanBarmanList(): Observable<any> {
    return this.http.get(`${this.mastersUrl}/salesmanbarman/list /`);
  }

  createSalesmanBarman(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/salesman_barman/create/`, data);
  }

  getSalesmanBarmanDetail(id: number): Observable<any> {
    return this.http.get(`${this.mastersUrl}/salesmanbarman/detail/${id}/`);
  }

  setSalesmanBarmanDocuments(docs: Partial<Record<keyof SalesmanBarmanDocuments, File>>): void {
    this.salesmanBarmanDocs = { ...this.salesmanBarmanDocs, ...docs };
  }

  getSalesmanBarmanDocuments(): Partial<Record<keyof SalesmanBarmanDocuments, File>> {
    return this.salesmanBarmanDocs;
  }

  clearSalesmanBarmanDocuments(): void {
    this.salesmanBarmanDocs = {};
  }

  // ========================== COMPANY REGISTRATION ==========================

  getCompanyList(): Observable<any> {
    return this.http.get(`${this.mastersUrl}/company/list/`);
  }

  createCompany(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/company_registration/create/`, data);
  }

  getCompanyDetail(id: number): Observable<any> {
    return this.http.get(`${this.mastersUrl}/company/detail/${id}/`);
  }

  setCompanyDocuments(docs: Partial<Record<keyof CompanyDocuments, File>>): void {
    this.companyDocs = docs;
  }

  getCompanyDocuments(): Partial<Record<keyof CompanyDocuments, File>> {
    return this.companyDocs;
  }

  clearCompanyDocuments(): void {
    this.companyDocs = {};
  }
}