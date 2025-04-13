import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importing the CommonModule for common Angular directives
import { MaterialModule } from '../../../shared/material.module'; // Importing MaterialModule for Angular Material components

// Interface to define the structure for the license statistics data
export interface LicenseStatistics {
  slNo: number;            // Serial number for each record
  serviceName: string;     // Name of the service (e.g., New License Application)
  applied: string;         // Number of applications for the service
  rejected: number;        // Number of rejected applications
  approved: number;        // Number of approved applications
  executed: string;        // Number of executed services
  pending: number;         // Number of pending applications
  pendingWithMe: number;   // Number of pending applications with the current user
}

// Sample data for LicenseStatistics, representing different services
const LICENSE_DATA: LicenseStatistics[] = [
  {slNo: 1, serviceName: 'New License Application', applied: '102', rejected: 0, approved: 14, executed: '9', pending: 88, pendingWithMe: 0},
  {slNo: 2, serviceName: 'Renewal of Excise License', applied: '3,372', rejected: 0, approved: 0, executed: '3,352', pending: 20, pendingWithMe: 0},
  {slNo: 3, serviceName: 'Label Registration of Packaged Liquor', applied: '0', rejected: 0, approved: 0, executed: '0', pending: 0, pendingWithMe: 0},
  {slNo: 4, serviceName: 'Import of Bulk Spirit', applied: '0', rejected: 0, approved: 0, executed: '0', pending: 88, pendingWithMe: 0},
  {slNo: 5, serviceName: 'Import of Packaged Foreign Liquor', applied: '0', rejected: 0, approved: 0, executed: '0', pending: 0, pendingWithMe: 0},
  {slNo: 6, serviceName: 'Import Packaged Foreign Liquor from Custom Station', applied: '0', rejected: 0, approved: 0, executed: '0', pending: 0, pendingWithMe: 0},
];

// The DashboardComponent handles displaying the license statistics in a table
@Component({
  selector: 'app-dashboard', // The selector used to render this component in HTML
  standalone: true,          // Indicates that this is a standalone component (can be used independently)
  imports: [CommonModule, MaterialModule], // Import necessary modules (CommonModule for basic Angular directives and MaterialModule for Material components)
  templateUrl: './dashboard.component.html', // Path to the HTML template for this component
  styleUrls: ['./dashboard.component.scss'], // Path to the CSS file for styling this component
})
export class DashboardComponent {
  // Columns to be displayed in the table, matching the properties of LicenseStatistics
  displayedColumns: string[] = ['slNo', 'serviceName', 'rejected', 'approved', 'executed', 'pending', 'pendingWithMe'];

  // Data source for the table, which is the LICENSE_DATA array
  dataSource = LICENSE_DATA;
}
