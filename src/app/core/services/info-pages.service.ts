import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  NodalOfficer,
  PublicInformationOfficer,
  DirectorateAndDistrictOfficials,
  GrievanceRedressalOfficer
} from '../../core/models/contact-us.model';

@Injectable({
  providedIn: 'root'
})
export class InfoPagesService {
  // Base URL from environment configuration
  private baseUrl = environment.baseUrl;

  // Master data API endpoint
  private apiUrl = `${this.baseUrl}/masters`;

  constructor(private http: HttpClient) {}

  // Fetch list of Nodal Officers
  getNodalOfficers(): Observable<NodalOfficer[]> {
    return this.http.get<NodalOfficer[]>(`${this.apiUrl}/nodalofficer/list/`);
  }

  // Fetch list of Public Information Officers
  getPublicInformationOfficers(): Observable<PublicInformationOfficer[]> {
    return this.http.get<PublicInformationOfficer[]>(`${this.apiUrl}/publicinformationofficer/list/`);
  }

  // Fetch list of Directorate and District Officials
  getDirectorateAndDistrictOfficials(): Observable<DirectorateAndDistrictOfficials[]> {
    return this.http.get<DirectorateAndDistrictOfficials[]>(`${this.apiUrl}/directoratendistrictofficials/list/`);
  }

  // Fetch list of Grievance Redressal Officers
  getGrievanceRedressalOfficers(): Observable<GrievanceRedressalOfficer[]> {
    return this.http.get<GrievanceRedressalOfficer[]>(`${this.apiUrl}/grievanceredressalofficer/list/`);
  }
}
