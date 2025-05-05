import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importing the CommonModule for common Angular directives
import { MaterialModule } from '../../../shared/material.module'; // Importing MaterialModule for Angular Material components
import { BaseComponent } from '../../../base/base.components'; // Import BaseComponent
import { BaseDependency } from '../../../base/dependency/base.dependendency'; // Import BaseDependency
import Swal from 'sweetalert2';

// Interface to define the structure for the license statistics data
export interface Applied {
  applicationId: number;   
  status: string;        
  remarks: string;        
}

export interface Approved {
  applicationId: number;   
  status: string;        
  remarks: string;        
}

export interface Pending {
  applicationId: number;   
  status: string;        
  remarks: string;        
}

export interface LicenseStatistics {
  slNo: number;            // Serial number for each record
  serviceName: string;     // Name of the service (e.g., New License Application)
  applied: string;         // Number of applications for the service
  rejected: number;        // Number of rejected applications
  approved: number;        // Number of approved applications
  executed: string;        // Number of executed services
  pending: number;         // Number of pending applications
}

// Sample data for LicenseStatistics, representing different services
const LICENSE_DATA: LicenseStatistics[] = [
  {slNo: 1, serviceName: 'New License Application', applied: '102', rejected: 0, approved: 14, executed: '9', pending: 88},
  {slNo: 2, serviceName: 'Renewal of Excise License', applied: '3,372', rejected: 0, approved: 0, executed: '3,352', pending: 20},
  {slNo: 3, serviceName: 'Label Registration of Packaged Liquor', applied: '0', rejected: 0, approved: 0, executed: '0', pending: 0},
  {slNo: 4, serviceName: 'Import of Bulk Spirit', applied: '0', rejected: 0, approved: 0, executed: '0', pending: 88},
  {slNo: 5, serviceName: 'Import of Packaged Foreign Liquor', applied: '0', rejected: 0, approved: 0, executed: '0', pending: 0},
  {slNo: 6, serviceName: 'Import Packaged Foreign Liquor from Custom Station', applied: '0', rejected: 0, approved: 0, executed: '0', pending: 0},
];

const APPLIED_DATA: Applied[] = [
  {applicationId: 202500001, status: 'With Permit Section', remarks: 'N/A'},
  {applicationId: 202500002, status: 'With Permit Section', remarks: 'N/A'},
  {applicationId: 202500003, status: 'With Permit Section', remarks: 'N/A'},
  {applicationId: 202500004, status: 'With Permit Section', remarks: 'N/A'},
  {applicationId: 202500005, status: 'With Permit Section', remarks: 'N/A'},
];

const APPROVED_DATA: Approved[] = [
  {applicationId: 202500001, status: 'License Approved', remarks: 'N/A'},
  {applicationId: 202500002, status: 'License Approved', remarks: 'N/A'},
  {applicationId: 202500003, status: 'License Approved', remarks: 'N/A'},
  {applicationId: 202500004, status: 'License Approved', remarks: 'N/A'},
  {applicationId: 202500005, status: 'License Approved', remarks: 'N/A'},
];

const PENDING_DATA: Pending[] = [
  {applicationId: 202500001, status: 'Forwarded to Commissioner', remarks: 'N/A'},
  {applicationId: 202500002, status: 'Forwarded to Commissioner', remarks: 'N/A'},
  {applicationId: 202500003, status: 'Forwarded to Commissioner', remarks: 'N/A'},
  {applicationId: 202500004, status: 'Forwarded to Commissioner', remarks: 'N/A'},
  {applicationId: 202500005, status: 'Forwarded to Commissioner', remarks: 'N/A'},
];

// The DashboardComponent handles displaying the license statistics in a table
@Component({
  selector: 'app-dashboard', // The selector used to render this component in HTML
  standalone: true,          // Indicates that this is a standalone component (can be used independently)
  imports: [CommonModule, MaterialModule], // Import necessary modules (CommonModule for basic Angular directives and MaterialModule for Material components)
  templateUrl: './dashboard.component.html', // Path to the HTML template for this component
  styleUrls: ['./dashboard.component.scss'], // Path to the CSS file for styling this component
})
export class DashboardComponent extends BaseComponent{

  constructor(public baseDependancy: BaseDependency) { 
    super(baseDependancy);
  }
  
  // Columns to be displayed in the tables
  statsColumns: string[] = ['slNo', 'serviceName', 'rejected', 'approved', 'executed', 'pending'];
  appliedColumns: string[] = ['applicationId', 'status', 'remarks', 'actions'];
  approvedColumns: string[] = ['applicationId', 'status', 'remarks'];
  pendingColumns: string[] = ['applicationId', 'status', 'remarks'];

  // Data source for the tables
  statsDataSource = LICENSE_DATA;
  appliedDataSource = APPLIED_DATA;
  approvedDataSource = APPROVED_DATA;
  pendingDataSource = PENDING_DATA;

  activeTable: 'stats' | 'applied' | 'approved' | 'pending' = 'stats';

  showTable(table: 'applied' | 'approved' | 'pending') {
    this.activeTable = table;
  }

  goBackToStats() {
    this.activeTable = 'stats';
  }

  onView(application: Applied): void {
    Swal.fire({
      title: `Application ID: ${application.applicationId}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Status:</strong> ${application.status}</p>
          <p><strong>Remarks:</strong> ${application.remarks}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Accept',
      cancelButtonText: 'Reject',
      showCloseButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        this.onAccept(application);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.onReject(application);
      }
    });
  }  

  onAccept(application: Applied): void {
    this.acceptStep1_review(application);
  }
  
  acceptStep1_review(application: Applied): void {
    Swal.fire({
      title: 'Step 1: Review Remarks',
      input: 'textarea',
      inputLabel: 'Write your review remarks',
      inputPlaceholder: 'Enter remarks here...',
      inputAttributes: {
        'aria-label': 'Review remarks',
      },
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Next',
      denyButtonText: 'Back',
      showCloseButton: true,
      inputValue: '', // Optional: keep previous input
    }).then(result => {
      if (result.isConfirmed) {
        const remarks = result.value || '';
        this.acceptStep2_forward(application, remarks);
      } else if (result.isDenied) {
        this.onView(application); // Go back to application view
      }
    });
  }
  
  acceptStep2_forward(application: Applied, reviewRemarks: string): void {
    Swal.fire({
      title: 'Step 2: Forward To',
      input: 'select',
      inputOptions: {
        commissioner: 'Commissioner',
        jointCommissioner: 'Joint Commissioner'
      },
      inputPlaceholder: 'Select role to forward to',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Next',
      denyButtonText: 'Back',
      showCloseButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        const forwardTo = result.value;
        this.acceptStep3_confirm(application, reviewRemarks, forwardTo);
      } else if (result.isDenied) {
        this.acceptStep1_review(application); // Go back to review step
      }
    });
  }
  
  acceptStep3_confirm(application: Applied, reviewRemarks: string, forwardTo: string): void {
    const roleLabel = forwardTo === 'commissioner' ? 'Commissioner' : 'Joint Commissioner';
  
    Swal.fire({
      title: 'Step 3: Confirm Forwarding',
      html: `
        <p><strong>Remarks:</strong> ${reviewRemarks}</p>
        <p><strong>Forward To:</strong> ${roleLabel}</p>
      `,
      icon: 'question',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Confirm',
      denyButtonText: 'Back',
      showCloseButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        // Replace with your API call
        console.log('Submitted:', {
          applicationId: application.applicationId,
          reviewRemarks,
          forwardTo
        });
  
        Swal.fire('Success!', `Application forwarded to ${roleLabel}.`, 'success');
      } else if (result.isDenied) {
        this.acceptStep2_forward(application, reviewRemarks); // Go back to forward step
      }
    });
  }  
  
  
  onReject(application: Applied): void {
    this.rejectStep1_review(application);
  }
  
  rejectStep1_review(application: Applied): void {
    Swal.fire({
      title: 'Step 1: Rejection Remarks',
      input: 'textarea',
      inputLabel: 'Write reason for rejection',
      inputPlaceholder: 'Enter remarks here...',
      inputAttributes: {
        'aria-label': 'Rejection remarks',
      },
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Next',
      denyButtonText: 'Back',
      showCloseButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        const remarks = result.value || '';
        this.rejectStep2_confirm(application, remarks);
      } else if (result.isDenied) {
        this.onView(application); // Go back to View dialog
      }
    });
  }
  
  rejectStep2_confirm(application: Applied, remarks: string): void {
    Swal.fire({
      title: 'Step 2: Confirm Rejection',
      html: `
        <p><strong>Application ID:</strong> ${application.applicationId}</p>
        <p><strong>Remarks:</strong> ${remarks}</p>
      `,
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Confirm Reject',
      denyButtonText: 'Back',
      showCloseButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        // Perform rejection logic
        console.log('Rejected:', application, 'Remarks:', remarks);
  
        Swal.fire('Rejected!', 'The application was rejected successfully.', 'success');
      } else if (result.isDenied) {
        this.rejectStep1_review(application);
      }
    });
  }
  
}
