import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../../../../../shared/material.module';
import { SiteAdminService } from '../../../../site-admin-service';
import { Company, CompanyDocuments } from '../../../../../../core/models/company.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-application',
  imports: [MaterialModule],
  templateUrl: './submit-application.component.html',
  styleUrl: './submit-application.component.scss'
})
export class SubmitApplicationComponent {
  // Labels for displaying company details in a user-friendly format
  readonly companyRegistrationLabels: Partial<Record<keyof Company, string>> = {
    brandType: 'Brand Type',
    license: 'License',
    applicationYear: 'Application Year',
    companyName: 'Company Name',
    pan: 'PAN',
    officeAddress: 'Office Address',
    country: 'Country',
    state: 'State',
    factoryAddress: 'Factory Address',
    pinCode: 'PIN Code',
    companyMobileNumber: 'Company Mobile Number',
    companyEmailId: 'Company Email Id',
    memberName: 'Member Name',
    memberDesignation: 'Member Designation',
    memberMobileNumber: 'Member Mobile Number',
    memberEmailId: 'Member Email Id',
    memberAddress: 'Member Address',
    paymentId: 'Payment Id',
    paymentDate: 'Payment Date',
    paymentAmount: 'Payment Amount',
    paymentRemarks: 'Payment Remarks'
  };

  // Labels for documents
  readonly documentLabels: Partial<Record<keyof CompanyDocuments, string>> = {
    undertaking: 'Undertaking',
  };

  // Output event to navigate back
  @Output() back = new EventEmitter<void>();

  constructor(private siteAdminService: SiteAdminService, private router: Router) {}

  // Retrieve and format company details from session storage
  get companyDetails() {
    return this.getGroupedEntries<Partial<Company>>('companyDetails', this.companyRegistrationLabels);
  }

  // Retrieve and format member details from session storage
  get memberDetails() {
    return this.getGroupedEntries<Partial<Company>>('memberDetails', this.companyRegistrationLabels);
  }

  // Retrieve and format payment details from session storage
  get paymentDetails() {
    return this.getGroupedEntries<Partial<Company>>('paymentDetails', this.companyRegistrationLabels);
  }

  // Retrieve documents from session storage and format them for display
  get companyDocuments(): { key: keyof CompanyDocuments; fileUrl: string }[] {
    const storedDocs = sessionStorage.getItem('companyDocuments');
    if (!storedDocs) return [];

    try {
      const parsedDocs: Record<keyof CompanyDocuments, string> = JSON.parse(storedDocs);
      return Object.entries(parsedDocs).map(([key, fileUrl]) => ({
        key: key as keyof CompanyDocuments,
        fileUrl: fileUrl || ''
      }));
    } catch (error) {
      console.error("Error parsing companyDocuments:", error);
      return [];
    }
  }

  // Helper to map raw object from session storage to label-value pairs
  private getGroupedEntries<T extends Record<string, any>>(
    groupKey: string,
    labels: Record<string, string>
  ): { key: string; value: any }[] {
    const storedData = sessionStorage.getItem(groupKey);
    if (!storedData) return [];

    try {
      const parsedData: T = JSON.parse(storedData);
      return Object.keys(parsedData).map(key => ({
        key: labels[key] || key,
        value: parsedData[key]
      }));
    } catch (error) {
      console.error(`Error parsing sessionStorage key "${groupKey}":`, error);
      return [];
    }
  }

  // Converts blob URL (base64) to a File object for uploading
  private async blobUrlToFile(blobUrl: string, filename: string): Promise<File> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    const mimeType = blob.type;
    let extension = '';

    switch (mimeType) {
      case 'application/pdf':
        extension = '.pdf';
        break;
      case 'image/jpeg':
        extension = '.jpg';
        break;
      case 'image/png':
        extension = '.png';
        break;
    }

    return new File([blob], `${filename}${extension}`, { type: mimeType });
  }

  // Handles submission of the application
  async submit(): Promise<void> {
    // Confirmation before submitting
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit this application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
    });

    if (!confirm.isConfirmed) return;

    try {
      // Retrieve all parts of the form from session storage
      const companyDetails: Partial<Company> = JSON.parse(sessionStorage.getItem('companyDetails') || '{}');
      const memberDetails: Partial<Company> = JSON.parse(sessionStorage.getItem('memberDetails') || '{}');
      const paymentDetails: Partial<Company> = JSON.parse(sessionStorage.getItem('paymentDetails') || '{}');
      const companyDocuments: Record<keyof CompanyDocuments, string> =
        JSON.parse(sessionStorage.getItem('companyDocuments') || '{}');

      if (!companyDetails || !memberDetails || !paymentDetails || !companyDocuments) {
        alert('Missing application data. Please complete the form.');
        return;
      }

      // Construct FormData object
      const formData = new FormData();
      const combinedDetails = { ...companyDetails, ...memberDetails, ...paymentDetails };

      // Append all key-value fields
      Object.entries(combinedDetails).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Append documents
      for (const [key, blobUrl] of Object.entries(companyDocuments)) {
        const file = await this.blobUrlToFile(blobUrl, key);
        formData.append(key, file);
      }

      // Submit the data to backend
      this.siteAdminService.createCompany(formData).subscribe({
        next: (res) => {
          Swal.fire('Submitted!', 'Application submitted successfully!', 'success').then(() => {
            sessionStorage.clear(); // Clear all stored data
            this.router.navigate(['/site-admin/dashboard']); // Redirect to dashboard
          });
        },
        error: (err) => {
          console.error('❌ Submission failed:', err.error);
          const message = err?.error?.detail || 'Failed to submit application.';
          Swal.fire('Error', message, 'error');
        }
      });

    } catch (error) {
      console.error('Unexpected error during submission:', error);
      Swal.fire('Error', 'An unexpected error occurred.', 'error');
    }
  }

  // Emit event to go back to previous step
  goBack() {
    this.back.emit();
  }
}
