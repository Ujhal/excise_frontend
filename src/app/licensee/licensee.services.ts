import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { District } from '../shared/models/district.model';
import { Dashboard } from '../shared/models/dashboard.model';
import { SubDivision } from '../shared/models/subdivision.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteAdminService {
  private baseUrl = environment.baseUrl;
  private apiUrl = `${this.baseUrl}/api`
  constructor(private http: HttpClient) {}

}