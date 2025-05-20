import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { BaseComponent } from '../../../base/base.components';
import { BaseDependency } from '../../../base/dependency/base.dependendency';
import Swal from 'sweetalert2';
import { SiteAdminService } from '../site-admin-service';
import { ApplicationStage, DashboardCount } from '../../../core/models/dashboard.model';
import { MatTableDataSource } from '@angular/material/table';
import { LicenseApplicationService } from '../../../core/services/license-application.service';

// Interface for license statistics
export interface LicenseStatistics {
  slNo: number;           
  serviceName: string;   
  applied: string;       
  rejected: number;
  approved: number;       
  executed: string;      
  pending: number;        
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

@Component({
  selector: 'app-dashboard', 
  standalone: true,         
  imports: [CommonModule, MaterialModule], 
  templateUrl: './dashboard.component.html', 
  styleUrls: ['./dashboard.component.scss'], 
})
export class DashboardComponent extends BaseComponent {
  // Dashboard counts for pending, approved, and rejected applications
  dashboardCounts: DashboardCount = { pending: 0, approved: 0, rejected: 0 };

  // Arrays to store applications 
  pendingApplications: ApplicationStage[] = [];
  approvedApplications: ApplicationStage[] = [];
  rejectedApplications: ApplicationStage[] = [];

  constructor(
    public baseDependancy: BaseDependency, 
    protected licenseApplicationService: LicenseApplicationService 
  ) { 
    super(baseDependancy); // Calling the parent class constructor
  }

  // Table Data Sources
  statsDataSource = LICENSE_DATA; // Data source for license statistics
  pendingDataSource = new MatTableDataSource<ApplicationStage>(); // Data source for pending applications
  approvedDataSource = new MatTableDataSource<ApplicationStage>(); // Data source for approved applications
  rejectedDataSource = new MatTableDataSource<ApplicationStage>(); // Data source for rejected applications
  
  // Columns to be displayed in the tables
  statsColumns: string[] = ['slNo', 'serviceName', 'rejected', 'approved', 'executed', 'pending'];
  pendingColumns: string[] = ['id', 'currentStage', 'remarks', 'isApproved', 'performedBy',  'timestamp', 'actions'];
  approvedColumns: string[] = ['id', 'currentStage', 'remarks', 'isApproved', 'performedBy', 'timestamp', 'actions'];
  rejectedColumns: string[] = ['id', 'currentStage', 'remarks', 'isApproved', 'performedBy', 'timestamp', 'actions'];

  // Active table to display
  activeTable: 'stats' | 'pending' | 'approved' | 'rejected' = 'stats';

  // Method to switch to a specific table
  showTable(table: 'pending' | 'approved' | 'rejected') {
    this.activeTable = table;
  }

  // Method to go back to the statistics table
  goBackToStats() {
    this.activeTable = 'stats';
  }

  // Lifecycle hook to initialize data
  ngOnInit(): void {
    // Fetch dashboard counts
    this.licenseApplicationService.getDashboardCounts().subscribe({
      next: (res) => {
        this.dashboardCounts = res; // Update dashboard counts
      },
      error: (err) => {
        console.error('Failed to fetch dashboard counts', err); // Log error
      }
    });

    // Fetch applications by stage
    this.licenseApplicationService.getApplicationsByStatus().subscribe(res => {
      this.pendingDataSource.data = res.pending; 
      this.approvedDataSource.data = res.approved; 
      this.rejectedDataSource.data = res.rejected;
      console.log(this.pendingDataSource.data);
    }, error => {
      console.error('Error fetching applications:', error); // Log error
    });
  }

  // Mapping for displaying current stage
  stageDisplayMapping: { [key: string]: string } = {
    permit_section: 'Under Review by Permit Section',
    commissioner: 'Under Review by Commissioner',
    joint_commissioner: 'Under Review by Joint Commissioner',
    approved: 'Application Approved',
    rejected_by_permit_section: 'Rejected by Permit Section',
    rejected_by_commissioner: 'Application Rejected',
    rejected_by_joint_commissioner: 'Application Rejected',
  };

  // Mapping for displaying roles
  roleDisplayMapping: { [key: string]: string } = {
    permit_section: 'Permit Section',
    commissioner: 'Commissioner',
    joint_commissioner: 'Joint Commissioner',
    licensee: 'Licensee',
  };

  // Method to view application details
  onView(application: any): void {
    const photoUrl = application.photo 
      ? `http://127.0.0.1:8000/${application.photo}` 
      : null;

    const details = `
      <div style="text-align: left; max-height: 400px; overflow-y: auto; font-size: 14px;">
        <p><strong>Establishment Name:</strong> ${application.establishmentName || 'N/A'}</p>
        <p><strong>License:</strong> ${application.license || 'N/A'}</p>
        <p><strong>License No:</strong> ${application.licenseNo || 'N/A'}</p>
        <p><strong>License Type:</strong> ${application.licenseType || 'N/A'}</p>
        <p><strong>License Nature:</strong> ${application.licenseNature || 'N/A'}</p>
        <p><strong>License Category:</strong> ${application.licenseCategory || 'N/A'}</p>
        <p><strong>Functioning Status:</strong> ${application.functioningStatus || 'N/A'}</p>
        <p><strong>Location Category:</strong> ${application.locationCategory || 'N/A'}</p>
        <p><strong>Location Name:</strong> ${application.locationName || 'N/A'}</p>
        <p><strong>Excise District:</strong> ${application.exciseDistrict || 'N/A'}</p>
        <p><strong>Excise Sub-Division:</strong> ${application.exciseSubDivision || 'N/A'}</p>
        <p><strong>Site Sub-Division:</strong> ${application.siteSubDivision || 'N/A'}</p>
        <p><strong>Police Station:</strong> ${application.policeStation || 'N/A'}</p>
        <p><strong>Ward Name:</strong> ${application.wardName || 'N/A'}</p>
        <p><strong>Road Name:</strong> ${application.roadName || 'N/A'}</p>
        <p><strong>Pin Code:</strong> ${application.pinCode || 'N/A'}</p>
        <p><strong>Mode of Operation:</strong> ${application.modeofOperation || 'N/A'}</p>
        <p><strong>Status:</strong> ${application.status || 'N/A'}</p>
        <p><strong>Gender:</strong> ${application.gender || 'N/A'}</p>
        <p><strong>Father/Husband Name:</strong> ${application.fatherHusbandName || 'N/A'}</p>
        <p><strong>Nationality:</strong> ${application.nationality || 'N/A'}</p>
        <p><strong>Email ID:</strong> ${application.emailId || 'N/A'}</p>
        <p><strong>Mobile Number:</strong> ${application.mobileNumber || 'N/A'}</p>
        <p><strong>Member Name:</strong> ${application.memberName || 'N/A'}</p>
        <p><strong>Member Email ID:</strong> ${application.memberEmailId || 'N/A'}</p>
        <p><strong>Member Mobile Number:</strong> ${application.memberMobileNumber || 'N/A'}</p>
        <p><strong>PAN:</strong> ${application.pan || 'N/A'}</p>
        <p><strong>Company Name:</strong> ${application.companyName || 'N/A'}</p>
        <p><strong>Company Email:</strong> ${application.companyEmailId || 'N/A'}</p>
        <p><strong>Company CIN:</strong> ${application.companyCin || 'N/A'}</p>
        <p><strong>Company PAN:</strong> ${application.companyPan || 'N/A'}</p>
        <p><strong>Company Phone:</strong> ${application.companyPhoneNumber || 'N/A'}</p>
        <p><strong>Business Address:</strong> ${application.businessAddress || 'N/A'}</p>
        <p><strong>Company Address:</strong> ${application.companyAddress || 'N/A'}</p>
        <p><strong>Incorporation Date:</strong> ${application.incorporationDate || 'N/A'}</p>
        <p><strong>Initial Grant Date:</strong> ${application.initialGrantDate || 'N/A'}</p>
        <p><strong>Valid Up To:</strong> ${application.validUpTo || 'N/A'}</p>
        <p><strong>Latitude:</strong> ${application.latitude || 'N/A'}</p>
        <p><strong>Longitude:</strong> ${application.longitude || 'N/A'}</p>
        <p><strong>Current Stage:</strong> ${application.current_stage || 'N/A'}</p>
        <p><strong>Approved:</strong> ${application.is_approved ? 'Yes' : 'No'}</p>
        ${photoUrl ? `<p><strong>Photo:</strong><br><img src="${photoUrl}" alt="Applicant Photo" style="max-width: 100%; height: auto; border: 1px solid #ccc; margin-bottom: 10px;" /></p>` : ''}    </div> 
    `;

    Swal.fire({
      title: `Application Id: ${application.id}`,
      html: details,
      showCancelButton: true,
      confirmButtonText: 'Approve',
      cancelButtonText: 'Reject',
      showCloseButton: true,
      width: 500,
    }).then(result => {
      if (result.isConfirmed) {
        this.onApprove(application); // Handle application approval
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.onReject(application); // Handle application rejection
      }
    });
  }

  // Method to handle application approval
  onApprove(application: ApplicationStage): void {
    this.approveStep1_review(application); // Start approval process
  }

  // Step 1: Review remarks for acceptance
  approveStep1_review(application: ApplicationStage): void {
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
      inputValue: '', // Optional: to prefill on revisit
      inputValidator: (value) => {
        if (!value) {
          return 'Remarks are required to proceed.';
        }
        return null;
      }
    }).then(result => {
      if (result.isConfirmed) {
        const remarks = result.value || ''; // Get remarks
        const currentRole = localStorage.getItem('role'); // Get current user role
        if (currentRole === 'permit_section') {
          this.approveStep2_forward(application, remarks); // Forward to next role
        } else {
          this.approveStep3_confirm(application, remarks); // Skip forward step
        }
      } else if (result.isDenied) {
        this.onView(application); // Go back to view dialog
      }
    });
  }

  // Step 2: Forward application to another role
  approveStep2_forward(application: ApplicationStage, remarks: string): void {
    Swal.fire({
      title: 'Step 2: Forward To',
      input: 'select',
      inputOptions: {
        commissioner: 'Commissioner',
        joint_commissioner: 'Joint Commissioner'
      },
      inputPlaceholder: 'Select role to forward to',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Next',
      denyButtonText: 'Back',
      showCloseButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You must select a role to proceed.';
        }
        return null;
      }
    }).then(result => {
      if (result.isConfirmed) {
        const forwardTo = result.value; // Get selected role
        this.approveStep3_confirm(application, remarks, forwardTo); // Proceed to confirmation
      } else if (result.isDenied) {
        this.approveStep1_review(application); // Go back to review step
      }
    });
  }

  // Step 3: Confirm application approval
  approveStep3_confirm(application: any, remarks: string, forwardTo?: string): void {  
    let action: string;
    if (forwardTo === 'commissioner' || forwardTo === 'joint_commissioner') {
      action = `forward_${forwardTo}`;
    }
    else{
      action = 'approve';
    }
    Swal.fire({
      title: 'Step 3: Confirm Approval',
      html: `
        <p><strong>Remarks:</strong> ${remarks}</p><p>${action}</p>
      `,
      icon: 'question',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Confirm',
      denyButtonText: 'Back',
      showCloseButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        // Call API to approve application
        this.licenseApplicationService.advanceApplication(application.id, action, remarks).subscribe({
          next: () => {
            Swal.fire('Approved!', 'The application was approved successfully.', 'success')
            .then(() => {
              location.reload(); // Refresh the page after showing success
            });
          },
          error: (error) => {
            Swal.fire('Error', error.error?.detail || 'Failed to approve application.', 'error')
          }
        });
      } else if (result.isDenied) {
        if (action === 'commissioner' || forwardTo === 'joint_commissioner') {
          // Go back to Step 2
          this.approveStep2_forward(application, remarks);
        } else {
          // Go back to Step 1
          this.approveStep1_review(application);
        }
      }
    });
  }
  
  // Method to handle application rejection
  onReject(application: ApplicationStage): void {
    this.rejectStep1_review(application); // Start rejection process
  }
  
  // Step 1: Review remarks for rejection
  rejectStep1_review(application: ApplicationStage): void {
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
      inputValidator: (value) => {
        if (!value) {
          return 'Remarks are required to proceed.';
        }
        return null;
      }
    }).then(result => {
      if (result.isConfirmed) {
        const remarks = result.value; // Guaranteed non-empty now
        this.rejectStep2_confirm(application, remarks); // Proceed to confirmation
      } else if (result.isDenied) {
        this.onView(application); // Go back to view dialog
      }
    });
  }
  
  // Step 2: Confirm application rejection
  rejectStep2_confirm(application: ApplicationStage, remarks: string): void {
    Swal.fire({
      title: 'Step 2: Confirm Rejection',
      html: `
        <p><strong>Application ID:</strong> ${application.id}</p>
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
        // Call API to reject application
        this.licenseApplicationService.advanceApplication(application.id, 'reject', remarks).subscribe({
          next: () => {
            Swal.fire('Rejected!', 'The application was rejected successfully.', 'success')
            .then(() => {
              location.reload(); // Refresh the page after showing success
            });
          },
          error: (error) => {
            Swal.fire('Error', error.error?.detail || 'Failed to reject application.', 'error');
          }
        });
      } else if (result.isDenied) {
        this.rejectStep1_review(application); // Go back to review step
      }
    });
  }
}