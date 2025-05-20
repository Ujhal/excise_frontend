export class DashboardCount {
  applied?: number;
  pending!: number;
  approved!: number;
  rejected!: number;
}

export interface ApplicationsByStage {
  applied: ApplicationStage[];
  pending: ApplicationStage[];
  approved: ApplicationStage[];
  rejected: ApplicationStage[];
}

export interface ApplicationStage {
  id: number;
  current_stage: string;
  transactions: Transaction;
  is_approved: boolean;
}

export interface Transaction {
  id: number;
  stage: string;
  remarks: string;
  timestamp: string;
  performed_by: number;
}
