import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface IMFLHologramProcurementItem {
  id?: number;
  ref_no?: string;
  reference_no?: string;
  referenceNo?: string;
  refNo?: string;
  applicant?: number;
  applicant_name?: string;
  applicantName?: string;
  applicant_email?: string;
  distributor_name?: string;
  distributorName?: string;
  license_number?: string;
  licenseNumber?: string;
  establishment_name?: string;
  establishmentName?: string;
  quantity: number;
  rate_per_piece?: number;
  ratePerPiece?: number;
  total_amount?: number;
  totalAmount?: number;
  payment_status?: string;
  paymentStatus?: string;
  payment_date?: string | null;
  paymentDate?: string | null;
  payment_details?: any;
  paymentDetails?: any;
  workflow?: number;
  workflow_name?: string;
  current_stage?: number;
  current_stage_name?: string;
  currentStageName?: string;
  status?: string;
  remarks?: string;
  allowed_actions?: string[];
  allowedActions?: string[];
  created_at?: string;
  createdAt?: string;
  submitted_date?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImflHologramProcurementService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/transactional/distributor-permit/hologram-procurement`;

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
