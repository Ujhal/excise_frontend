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

@Injectable({ providedIn: 'root' })
export class LicenseeService {
  // Base API URL from environment configuration
  private baseUrl = environment.baseUrl;

  // Masters API path
  private apiUrl = `${this.baseUrl}/masters`;

  constructor(private http: HttpClient) {}

  // Fetch list of districts
  getDistrict(): Observable<District[]> {
    return this.http.get<District[]>(`${this.apiUrl}/districts/list`);
  }

  // Fetch list of subdivisions
  getSubDivision(): Observable<SubDivision[]> {
    return this.http.get<SubDivision[]>(`${this.apiUrl}/subdivisions/list`);
  }

  // Fetch list of police stations
  getPoliceStations(): Observable<PoliceStation[]> {
    return this.http.get<PoliceStation[]>(`${this.apiUrl}/policestations/list`);
  }

  // Fetch list of license types
  getLicenseTypes(): Observable<LicenseType[]> {
    return this.http.get<LicenseType[]>(`${this.apiUrl}/licensetypes/list/`);
  }

  // Fetch list of license categories
  getLicenseCategories(): Observable<LicenseCategory[]> {
    return this.http.get<LicenseCategory[]>(`${this.apiUrl}/licensecategories/list`);
  } 
}
