import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../../../../../shared/material.module';
import { SiteAdminService } from '../../../../site-admin-service';
import { SalesmanBarman, SalesmanBarmanDocuments } from '../../../../../../core/models/salesman-barman.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-application',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './submit-application.component.html',
  styleUrl: './submit-application.component.scss'
})
export class SubmitApplicationComponent {

  readonly licenseLabels: Partial<Record<keyof SalesmanBarman, string>> = {
    applicationYear: 'Application Year',
    applicationId: 'Application ID',
    applicationDate: 'Application Date',
    district: 'District',
    licenseCategory: 'License Category',
    license: 'License',
    role: 'Mode of Operation',
  };
  
  readonly personLabels: Partial<Record<keyof SalesmanBarman, string>> = {
    firstName: 'First Name',
    middleName: 'Middle Name',
    lastName: 'Last Name',
    fatherHusbandName: 'Father/Husband Name',
    gender: 'Gender',
    dob: 'Date of Birth',
    nationality: 'Nationality',
    address: 'Address',
    pan: 'PAN',
    aadhaar: 'Aadhaar Number',
    mobileNumber: 'Mobile Number',
    emailId: 'Email',
    sikkimSubject: 'Sikkim Subject',
  };  
  
  readonly documentLabels: Partial<Record<keyof SalesmanBarmanDocuments, string>> = {
    passPhoto: 'Passport Size Photo',
    aadhaarCard: 'Aadhaar Card',
    residentialCertificate: 'Residential Certificate',
    dateofBirthProof: 'Date of Birth Proof',
  };  

  @Output() back = new EventEmitter<void>();

  constructor(private siteAdminService: SiteAdminService, private router: Router) {}

  get licenseDetails() {
    return this.getGroupedEntries<Partial<SalesmanBarman>>('licenseDetails', this.licenseLabels);
  }
  
  get personDetails() {
    return this.getGroupedEntries<Partial<SalesmanBarman>>('personDetails', this.personLabels);
  }  

  get salesmanBarmanDocuments(): { key: keyof SalesmanBarmanDocuments; fileUrl: string }[] {
    const storedDocs = sessionStorage.getItem('salesmanBarmanDocuments');
    if (!storedDocs) return [];

    try {
      const parsedDocs: Record<keyof SalesmanBarmanDocuments, string> = JSON.parse(storedDocs);
      return Object.entries(parsedDocs).map(([key, fileUrl]) => ({
        key: key as keyof SalesmanBarmanDocuments,
        fileUrl: fileUrl || ''
      }));
    } catch (error) {
      console.error("Error parsing salesmanBarmanDocuments:", error);
      return [];
    }
  }

  get role(): SalesmanBarman['role'] | null {
    const storedData = sessionStorage.getItem('licenseDetails');
    try {
      return storedData ? (JSON.parse(storedData) as SalesmanBarman).role : null;
    } catch {
      return null;
    }
  }

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

  private async blobUrlToFile(blobUrl: string, filename: string): Promise<File> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    
    // Determine file extension based on MIME type
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
      case 'image/gif':
        extension = '.gif';
        break;
      // Add more cases as needed
      default:
        extension = '.bin'; // Default binary file extension
    }
  
    return new File([blob], `${filename}${extension}`, { type: mimeType });
  }   

  async submit(): Promise<void> {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit this application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
    });
  
    if (!confirm.isConfirmed) {
      return; // Cancel submission
    }
  
    try {
      const licenseDetails: Partial<SalesmanBarman> = JSON.parse(sessionStorage.getItem('licenseDetails') || '{}');
      const personDetails: Partial<SalesmanBarman> = JSON.parse(sessionStorage.getItem('personDetails') || '{}');
      const salesmanBarmanDocuments: Record<keyof SalesmanBarmanDocuments, string> =
        JSON.parse(sessionStorage.getItem('salesmanBarmanDocuments') || '{}');
  
      if (!licenseDetails || !personDetails || !salesmanBarmanDocuments) {
        alert('Missing application data. Please complete the form.');
        return;
      }
  
      const formData = new FormData();
      const combinedDetails = { ...licenseDetails, ...personDetails };
  
      Object.entries(combinedDetails).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
  
      for (const [key, blobUrl] of Object.entries(salesmanBarmanDocuments)) {
        const file = await this.blobUrlToFile(blobUrl, key);
        formData.append(key, file);
      }
  
      this.siteAdminService.createSalesmanBarman(formData).subscribe({
        next: (res) => {
          Swal.fire('Submitted!', 'Application submitted successfully!', 'success').then(() => {
            sessionStorage.clear();
            this.router.navigate(['/site-admin/dashboard']);
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

  goBack() {
    this.back.emit();
  }
}
