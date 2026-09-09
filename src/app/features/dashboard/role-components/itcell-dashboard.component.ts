import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HologramDataService } from '../../licensee/supplyChain/services/hologram-data.service';
import { DistributorPermitService } from '../../../core/services/distributor-permit.service';
import { AccountService } from '../../../core/services/account.service';
import { DashboardStatisticsComponent } from '../../../shared/components/dashboard-statistics/dashboard-statistics.component';
import { UnifiedActionButtonsComponent } from '../../../shared/components/unified-action-buttons/unified-action-buttons.component';
import { UnifiedActionsService } from '../../../shared/services/unified-actions.service';

interface ITCellData {
  id?: number;
  referenceNo: string;
  submissionDate: string;
  companyName: string;
  status: string;
  amount: string;
  type: 'hologram';
  allowedActions?: string[];
  allowedActionConfigs?: any[];
  workflowId?: number;
  currentStage?: number;
  localQtyLakh?: number;
  exportQtyLakh?: number;
  defenceQtyLakh?: number;
}

@Component({
  selector: 'app-itcell-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DashboardStatisticsComponent,
    UnifiedActionButtonsComponent
  ],
  template: `
    <div class="itcell-dashboard">
      <!-- Dashboard Statistics -->
      <app-dashboard-statistics
        [statistics]="getDashboardStatistics()">
      </app-dashboard-statistics>

      <!-- Data Table -->
      <div class="data-table-section" *ngIf="false">
        <div class="table-container">
          <table class="table table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th>Ref. No.</th>
                <th>Date</th>
                <th>Company Name</th>
                <th>Local Qty (Lakh)</th>
                <th>Export Qty (Lakh)</th>
                <th>Defence Qty (Lakh)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let application of getPaged()">
                <td>{{ application.referenceNo }}</td>
                <td>{{ application.submissionDate }}</td>
                <td>{{ application.companyName }}</td>
                <td>{{ application.localQtyLakh || 0 }}</td>
                <td>{{ application.exportQtyLakh || 0 }}</td>
                <td>{{ application.defenceQtyLakh || 0 }}</td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(application.status)">
                    {{ application.status }}
                  </span>
                </td>
                <td>
                  <app-unified-action-buttons
                    [item]="application"
                    [itemType]="'hologram'"
                    [context]="'itcell'"
                    [includeActions]="['VIEW','PAY']"
                    (actionClicked)="onUnifiedAction($event)">
                  </app-unified-action-buttons>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-section" *ngIf="getTotalPages() > 1">
          <nav>
            <ul class="pagination justify-content-center">
              <li class="page-item" [class.disabled]="currentPage === 1">
                <button class="page-link" (click)="goToPage(currentPage - 1)">Previous</button>
              </li>
              <li class="page-item" *ngFor="let page of getPageNumbers()" [class.active]="page === currentPage">
                <button class="page-link" (click)="goToPage(page)">{{ page }}</button>
              </li>
              <li class="page-item" [class.disabled]="currentPage === getTotalPages()">
                <button class="page-link" (click)="goToPage(currentPage + 1)">Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Empty State removed (hide message) -->
    </div>
  `,
  styles: [`
    .itcell-dashboard {
      padding: 1rem;
      padding-bottom: 0;
    }

    .data-table-section {
      margin-top: 2rem;
    }

    .table-container {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .table {
      margin-bottom: 0;
    }

    .table th {
      border-top: none;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .table td {
      vertical-align: middle;
      font-size: 0.875rem;
    }

    .badge {
      font-size: 0.75rem;
    }

    .pagination-section {
      margin-top: 1.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h5 {
      margin-bottom: 0.5rem;
      color: #374151;
    }

    .empty-state p {
      margin-bottom: 0;
      font-size: 1rem;
    }
  `]
})
export class ITCellDashboardComponent implements OnInit {
  @Input() selectedModule: string = 'all';
  @Input() moduleCounts: Record<string, any> = {};

  // Services
  public accountService = inject(AccountService);
  private router = inject(Router);
  private hologramService = inject(HologramDataService);
  private distributorPermitService = inject(DistributorPermitService);
  private unifiedActionsService = inject(UnifiedActionsService);

  // Data properties
  allApplications: ITCellData[] = [];       // Only items requiring IT Cell review (for action table)
  allHologramItems: ITCellData[] = [];      // ALL hologram items (for stat boxes)
  filteredApplications: ITCellData[] = [];
  selectedApplicationType: string = 'all';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => this.loadHologramApplications(), 0);
  }

  loadHologramApplications(): void {
    const mapDistilleryItem = (item: any): ITCellData => ({
      id: item.id,
      referenceNo: item.refNo || `HOL-${item.id}`,
      submissionDate: this.formatDate(item.date || item.created_at),
      companyName: item.licenseeName || item.manufacturingUnit || 'N/A',
      status: item.status || 'SUBMITTED',
      amount: '0.00',
      type: 'hologram',
      allowedActions: item.allowedActions || item.allowed_actions || [],
      allowedActionConfigs: item.allowedActionConfigs || item.allowed_action_configs || [],
      workflowId: item.workflow || item.workflow_id || item.workflowId,
      currentStage: item.current_stage || item.currentStage || item.stage_id || item.stageId,
      localQtyLakh: Number(item.localQty || 0),
      exportQtyLakh: Number(item.exportQty || 0),
      defenceQtyLakh: Number(item.defenceQty || 0)
    });

    const mapDistributorItem = (item: any): ITCellData => ({
      id: item.id,
      referenceNo: item.reference_no || item.referenceNo || `DHP-${item.id}`,
      submissionDate: this.formatDate(item.created_at || item.submission_date || item.submissionDate),
      companyName: item.distributor_name || item.distributorName || item.licensee_name || 'N/A',
      status: item.current_stage_name || item.currentStageName || item.status || 'SUBMITTED',
      amount: '0.00',
      type: 'hologram',
      allowedActions: item.allowedActions || item.allowed_actions || [],
      allowedActionConfigs: item.allowedActionConfigs || item.allowed_action_configs || [],
      workflowId: item.workflow || item.workflow_id || item.workflowId,
      currentStage: item.current_stage || item.currentStage || item.stage_id || item.stageId,
      localQtyLakh: Number(item.total_cases || 0),
      exportQtyLakh: 0,
      defenceQtyLakh: 0
    });

    forkJoin({
      distillery: this.hologramService.getProcurements().pipe(catchError(() => of([]))),
      distributor: this.distributorPermitService.getHologramProcurements().pipe(catchError(() => of([])))
    }).subscribe({
      next: (res: any) => {
        const distilleryList = Array.isArray(res.distillery) ? res.distillery : (res.distillery?.results || res.distillery?.data || []);
        const distributorList = Array.isArray(res.distributor) ? res.distributor : (res.distributor?.results || res.distributor?.data || []);

        const mappedDistillery = distilleryList.map(mapDistilleryItem);
        const mappedDistributor = distributorList.map(mapDistributorItem);

        // All items for stat counts
        this.allHologramItems = [...mappedDistillery, ...mappedDistributor];

        // Only actionable items for the review table
        this.allApplications = this.allHologramItems.filter((item: any) => this.requiresITCellReview(item.status));

        this.applyFilters();
      },
      error: (error) => console.error('Error loading hologram applications:', error)
    });
  }

  private requiresITCellReview(status: string): boolean {
    const statusLower = status?.toLowerCase() || '';
    return statusLower.includes('submitted') || 
           statusLower.includes('under_it_cell_review') ||
           statusLower.includes('pending_verification');
  }

  private formatDate(dateValue: any): string {
    if (!dateValue) return '';
    try {
      return new Date(dateValue).toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }).replace(/ /g, '-');
    } catch (e) {
      return dateValue.toString();
    }
  }

  // Dashboard statistics methods — use ALL hologram items for correct totals
  // Uses same logic as itcell.component.ts isApprovedLikeStatus/isPendingLikeStatus
  private normalizeToken(value: any): string {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private isApproved(status: string): boolean {
    const t = this.normalizeToken(status);
    // Rejected/cancelled is never approved
    if (t.includes('rejected') || t.includes('cancelled')) return false;
    // Pending = still in IT Cell queue
    const isPending = t.includes('submittedhp') || t.includes('submitted') ||
                      t.includes('underitcellreview') || t.includes('itcellreview');
    // Approved = everything that passed IT Cell (not pending, not rejected)
    return !isPending;
  }

  private isForwarded(status: string): boolean {
    const t = this.normalizeToken(status);
    return (t.includes('forwarded') && t.includes('commissioner')) || t.includes('forwardedtocommissioner');
  }

  private isPending(status: string): boolean {
    const t = this.normalizeToken(status);
    if (t.includes('rejected') || t.includes('cancelled')) return false;
    return t.includes('submittedhp') || t.includes('submitted') ||
           t.includes('underitcellreview') || t.includes('itcellreview');
  }

  getDashboardStatistics() {
    if (this.selectedModule && this.selectedModule !== 'all') {
      const mc = this.moduleCounts?.[this.selectedModule];
      if (mc) {
        return {
          applied: Number(mc.applied || 0),
          pending: Number(mc.pending || 0),
          approved: Number(mc.approved || 0),
          rejected: Number(mc.rejected || 0)
        };
      }
    }

    if (this.moduleCounts) {
      const itCellModules = ['hologram', 'distributor-permit-hologram-procurement'];
      let applied = 0;
      let pending = 0;
      let approved = 0;
      let rejected = 0;
      let hasModuleCounts = false;

      itCellModules.forEach(m => {
        const mc = this.moduleCounts?.[m];
        if (mc) {
          hasModuleCounts = true;
          applied += Number(mc.applied || 0);
          pending += Number(mc.pending || 0);
          approved += Number(mc.approved || 0);
          rejected += Number(mc.rejected || 0);
        }
      });

      if (hasModuleCounts && (applied > 0 || pending > 0 || approved > 0 || rejected > 0)) {
        return { applied, pending, approved, rejected };
      }
    }

    return {
      applied:  this.allHologramItems.length,
      pending:  this.allHologramItems.filter(app => this.isPending(app.status)).length,
      approved: this.allHologramItems.filter(app => this.isApproved(app.status)).length,
      rejected: this.allHologramItems.filter(app => {
                  const t = this.normalizeToken(app.status);
                  return t.includes('rejected') || t.includes('cancelled');
                }).length
    };
  }

  getFilterOptions() {
    return [
      { value: 'all', label: 'All Applications' },
      { value: 'hologram', label: 'Hologram Applications' }
    ];
  }

  onDashboardFilterChange(filterValue: string): void {
    this.selectedApplicationType = filterValue;
    this.applyFilters();
  }

  private applyFilters(): void {
    if (this.selectedApplicationType === 'all') {
      this.filteredApplications = [...this.allApplications];
    } else {
      this.filteredApplications = this.allApplications.filter(app => app.type === this.selectedApplicationType);
    }
    this.currentPage = 1;
  }

  private getStatusCount(status: string): number {
    return this.allHologramItems.filter(app =>
      app.status.toLowerCase().includes(status.toLowerCase())
    ).length;
  }

  private getActionablePendingCount(): number {
    // Prefer DB workflow metadata (allowed actions) so pending count stays correct even when stage names change.
    return this.allApplications.filter((app) => {
      const actions = Array.isArray(app?.allowedActions) ? app.allowedActions : [];
      const upper = actions.map((a) => String(a || '').toUpperCase());
      return upper.includes('VERIFY') || upper.includes('FORWARD') || upper.includes('REJECT');
    }).length;
  }

  // Unified action handler
  onUnifiedAction(event: {action: string, item: any}): void {
    this.unifiedActionsService.executeAction(
      event.action, 
      event.item, 
      'hologram', 
      'itcell'
    ).subscribe({
      next: (result: any) => {
        if (result.success) {
          if (result.message) {
            alert(result.message);
          }
          if (['VERIFY', 'FORWARD', 'REJECT'].includes(event.action)) {
            this.loadHologramApplications();
          }
        } else {
          alert(`Action failed: ${result.message}`);
        }
      },
      error: (error: any) => {
        console.error('Action failed:', error);
        alert(`Action failed: ${error.message || 'Unknown error'}`);
      }
    });
  }

  // Utility methods
  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('verified') || statusLower.includes('forwarded')) return 'bg-success';
    if (statusLower.includes('rejected')) return 'bg-danger';
    if (statusLower.includes('submitted') || statusLower.includes('pending')) return 'bg-warning';
    if (statusLower.includes('under_review')) return 'bg-info';
    return 'bg-secondary';
  }

  // Pagination methods
  getTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredApplications.length / this.pageSize));
  }

  getPaged(): ITCellData[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredApplications.slice(start, start + this.pageSize);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }
}
