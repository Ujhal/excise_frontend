import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NodalOfficer, PublicInformationOfficer, DirectorateAndDistrictOfficials, GrievanceRedressalOfficer } from '../../core/models/contact-us.model';

@Injectable({
  providedIn: 'root'
})
export class InfoPagesService {
  private baseUrl = environment.baseUrl;
  private apiUrl = `${this.baseUrl}/masters`

  constructor(private http: HttpClient) {}

  getNodalOfficers(): Observable<NodalOfficer[]> {
    return this.http.get<NodalOfficer[]>(`${this.apiUrl}/nodalofficer/list/`);
  }

  getPublicInformationOfficers(): Observable<PublicInformationOfficer[]> {
    return this.http.get<PublicInformationOfficer[]>(`${this.apiUrl}/publicinformationofficer/list/`);
  }

  getDirectorateAndDistrictOfficials(): Observable<DirectorateAndDistrictOfficials[]> {
    return this.http.get<DirectorateAndDistrictOfficials[]>(`${this.apiUrl}/directoratendistrictofficials/list/`);
  }

  getGrievanceRedressalOfficers(): Observable<GrievanceRedressalOfficer[]> {
    return this.http.get<GrievanceRedressalOfficer[]>(`${this.apiUrl}/grievanceredressalofficer/list/`);
  }
}
