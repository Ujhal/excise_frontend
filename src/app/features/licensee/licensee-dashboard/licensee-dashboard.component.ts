import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module'; 
import { RouterModule } from '@angular/router'; 
import { BaseComponent } from '../../../base/base.components';
import { BaseDependency } from '../../../base/dependency/base.dependendency'; 
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ApplicationStage, DashboardCount } from '../../../core/models/dashboard.model';
import { LicenseApplicationService } from '../../../core/services/license-application.service';
import { ApplyLicenseComponent } from '../apply-license/apply-license.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-licensee-dashboard', 
  standalone: true, 
  imports: [ 
    MaterialModule, 
    RouterModule,
    MatDialogModule 
  ],
  templateUrl: './licensee-dashboard.component.html',
  styleUrl: './licensee-dashboard.component.scss'   
})
export class LicenseeDashboardComponent extends BaseComponent{
  // Dashboard counts for applied, pending, approved, and rejected applications
  dashboardCounts: DashboardCount = { applied: 0, pending: 0, approved: 0, rejected: 0 };

  // Arrays to store applications
  appliedApplications: ApplicationStage[] = [];
  pendingApplications: ApplicationStage[] = [];
  approvedApplications: ApplicationStage[] = [];
  rejectedApplications: ApplicationStage[] = [];

  constructor(
    public baseDependancy: BaseDependency,
    protected licenseApplicationService: LicenseApplicationService,
    private dialog: MatDialog
  ) { 
    super(baseDependancy); // Calling the parent class constructor
  }

  // Table Data Sources
  appliedDataSource = new MatTableDataSource<ApplicationStage>();
  pendingDataSource = new MatTableDataSource<ApplicationStage>();
  approvedDataSource = new MatTableDataSource<ApplicationStage>();
  rejectedDataSource = new MatTableDataSource<ApplicationStage>();
  
  // Columns to be displayed in the tables
  appliedColumns: string[] = ['id', 'currentStage', 'remarks', 'isApproved', 'timestamp', 'actions'];
  pendingColumns: string[] = ['id', 'currentStage', 'remarks', 'isApproved', 'performedBy',  'timestamp', 'actions'];
  approvedColumns: string[] = ['id', 'currentStage', 'remarks', 'isApproved', 'performedBy', 'timestamp', 'actions'];
  rejectedColumns: string[] = ['id', 'currentStage', 'remarks', 'isApproved', 'performedBy', 'timestamp', 'actions'];

  // Active table to display
  activeTable: 'default' | 'applied' | 'pending' | 'approved' | 'rejected' = 'default';

  // Method to switch to a specific table
  showTable(table: 'applied' | 'pending' | 'approved' | 'rejected') {
    this.activeTable = table;
  }

  // Method to go back to the default page
  goBack(){
    this.activeTable = 'default';
  }

  // Lifecycle hook to initialize data
  ngOnInit(): void {
    // Fetch dashboard counts
    this.licenseApplicationService.getDashboardCounts().subscribe({
      next: (res) => {
        this.dashboardCounts = res; // Update dashboard counts
      },
      error: (err) => {
        console.error('Failed to fetch dashboard counts', err);
      }
    });

    // Fetch applications by stage
    this.licenseApplicationService.getApplicationsByStatus().subscribe(res => {
      this.appliedDataSource.data = res.applied;
      this.pendingDataSource.data = res.pending;
      this.approvedDataSource.data = res.approved;
      this.rejectedDataSource.data = res.rejected;
      console.log(this.pendingDataSource.data); 
    }, error => {
      console.error('Error fetching applications:', error);
    });
  }

  // Mapping for displaying current stage
  stageDisplayMapping: { [key: string]: string } = {
    permit_section: 'Under Review by Permit Section',
    commissioner: 'Under Review by Commissioner',
    joint_commissioner: 'Under Review by Joint Commissioner',
    approved: 'Application Approved',
    rejected_by_permit_section: 'Rejected by Permit Section',
    rejected_by_commissioner: 'Rejected by Commissioner',
    rejected_by_joint_commissioner: 'Rejected by Joint Commissioner',
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
      confirmButtonText: 'Edit',
      cancelButtonText: 'Delete',
      showCloseButton: true,
      width: 500,
    }).then(result => {
      if (result.isConfirmed) {
        this.onEdit(application); // Handle application updation
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.onDelete(application); // Handle application deletion 
      }
    });
  }

  // Method to handle application updation
  onEdit(application: ApplicationStage): void {
    this.dialog.open(ApplyLicenseComponent, {
      width: '1000px',
      data: { applicationData: application }
    });
  }
  
  onDelete(application: ApplicationStage): void {
    Swal.fire({
      title: 'Are you sure you want to delete this application?',
      text: 'The application will be permanently deleted.',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Delete',
      denyButtonText: 'Cancel',
      showCloseButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        this.licenseApplicationService.deleteApplication(application.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'The application has been deleted successfully.', 'success')
            .then(() => {
              location.reload(); // Refresh the page after showing success
            });
          },
          error: (error) => {
            Swal.fire('Error', error.error?.detail || 'Failed to delete the application.', 'error');
          }
        });
      } 
    });
  }
}
