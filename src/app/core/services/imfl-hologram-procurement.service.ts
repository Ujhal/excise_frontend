import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface IMFLHologramProcurementItem {
  id?: number;
  ref_no?: string;
  applicant?: number;
  applicant_name?: string;
  applicant_email?: string;
  distributor_name?: string;
  license_number?: string;
  establishment_name?: string;
  quantity: number;
  rate_per_piece?: number;
  total_amount?: number;
  payment_status?: string;
  payment_date?: string | null;
  payment_details?: any;
  workflow?: number;
  workflow_name?: string;
  current_stage?: number;
  current_stage_name?: string;
  status?: string;
  remarks?: string;
  allowed_actions?: string[];
  allowedActions?: string[];
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImflHologramProcurementService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/transactional/distributor_permit/hologram-procurement`;

  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  triggerRefresh(): void {
    this.refreshSubject.next();
  }

  getProcurements(): Observable<IMFLHologramProcurementItem[]> {
    return this.http.get<IMFLHologramProcurementItem[]>(`${this.baseUrl}/`);
  }

  getProcurement(id: number): Observable<IMFLHologramProcurementItem> {
    return this.http.get<IMFLHologramProcurementItem>(`${this.baseUrl}/${id}/`);
  }

  createProcurement(data: {
    quantity: number;
    distributor_name?: string;
    license_number?: string;
    establishment_name?: string;
    remarks?: string;
  }): Observable<IMFLHologramProcurementItem> {
    return this.http.post<IMFLHologramProcurementItem>(`${this.baseUrl}/`, data).pipe(
      tap(() => this.triggerRefresh())
    );
  }

  performAction(id: number, action: string, remarks?: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}/action/`, { action, remarks }).pipe(
      tap(() => this.triggerRefresh())
    );
  }

  payViaWallet(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}/pay/`, {}).pipe(
      tap(() => this.triggerRefresh())
    );
  }
}
