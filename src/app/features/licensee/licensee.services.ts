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
  private baseUrl = environment.baseUrl;
  private apiUrl = `${this.baseUrl}/masters`

  constructor(private http: HttpClient) {}

  getDistrict(): Observable<District[]> {
    return this.http.get<District[]>(`${this.apiUrl}/districts/list`);
  }

  getSubDivision(): Observable<SubDivision[]> {
    return this.http.get<SubDivision[]>(`${this.apiUrl}/subdivisions/list`);
  }
  
  getPoliceStations() {
    return this.http.get<PoliceStation[]>(`${this.apiUrl}/policestations/list`);
  }

  getLicenseTypes(): Observable<LicenseType[]> {
    return this.http.get<LicenseType[]>(`${this.apiUrl}/licensetypes/list/`);
  }

  getLicenseCategories(): Observable<LicenseCategory[]> {
    return this.http.get<LicenseCategory[]>(`${this.apiUrl}/licensecategories/list`);
  } 

}