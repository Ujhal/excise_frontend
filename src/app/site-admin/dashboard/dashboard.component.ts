import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

export interface LicenseStatistics {
  slNo: number;
  serviceName: string;
  applied: string;
  rejected: number;
  approved: number;
  executed: string;
  pending: number;
  pendingWithMe: number;
}

const LICENSE_DATA: LicenseStatistics[] = [
  {slNo: 1, serviceName: 'New License Application', applied: '102', rejected: 0, approved: 14, executed: '9', pending: 88, pendingWithMe: 0},
  {slNo: 2, serviceName: 'Renewal of Excise License', applied: '3,372', rejected: 0, approved: 0, executed: '3,352', pending: 20, pendingWithMe: 0},
  {slNo: 3, serviceName: 'Label Registration of Packaged Liquor', applied: '0', rejected: 0, approved: 0, executed: '0', pending: 0, pendingWithMe: 0},
  {slNo: 4, serviceName: 'Import of Bulk Spirit', applied: '0', rejected: 0, approved: 0, executed: '0', pending: 88, pendingWithMe: 0},
  {slNo: 5, serviceName: 'Import of Packaged Foreign Liquor', applied: '0', rejected: 0, approved: 0, executed: '0', pending: 0, pendingWithMe: 0},
  {slNo: 6, serviceName: 'Import Packaged Foreign Liquor from Custom Station', applied: '0', rejected: 0, approved: 0, executed: '0', pending: 0, pendingWithMe: 0},
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent{
  displayedColumns: string[] = ['slNo', 'serviceName', 'rejected', 'approved', 'executed', 'pending', 'pendingWithMe'];
  dataSource = LICENSE_DATA;
}