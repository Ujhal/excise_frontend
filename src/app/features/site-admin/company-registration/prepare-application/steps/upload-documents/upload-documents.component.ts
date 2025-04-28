import { Component, EventEmitter, Output, OnDestroy, signal, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SiteAdminService } from '../../../../site-admin-service';
import { PatternConstants } from '../../../../../../shared/constants/pattern.constants';
import { MaterialModule } from '../../../../../../shared/material.module';
import { DatePipe } from '@angular/common';
import { Company, CompanyDocuments } from '../../../../../../core/models/company.model';

@Component({
  selector: 'app-upload-documents', 
  imports: [MaterialModule], // Importing Material UI module for the component
  templateUrl: './upload-documents.component.html', 
  styleUrl: './upload-documents.component.scss', 
  providers: [DatePipe] // Provides DatePipe to format dates
})
export class UploadDocumentsComponent implements OnDestroy {
  
  uploadDocumentsForm: FormGroup; // Form group for the document upload form

  @Output() readonly next = new EventEmitter<void>(); // Event emitter for next step
  @Output() readonly back = new EventEmitter<void>(); // Event emitter for going back

  private destroy$ = new Subject<void>(); // Subject to handle unsubscription

  errorMessages = { // Error messages for the form fields
    paymentId: signal(''),
    paymentDate: signal(''),
    paymentAmount: signal(''),
    paymentRemarks: signal('')
  };
  
  displayedColumns: string[] = ['serialNo', 'docType', 'upload', 'view']; // Columns for the displayed document table
  documents = [ // List of documents to be uploaded
    { 
      key: 'undertaking', 
      name: 'An Undertaking stating that they shall abide by the condition of the Certificate or registration and the provision of Sikkim Excise Act 1992 and rules, regulations and orders made thereunder', 
      format: 'pdf, png, jpg', 
      accept: '.pdf,.png,.jpg', 
      required: true, 
      file: null 
    },
  ];

  constructor(
    private fb: FormBuilder, 
    private siteAdminService: SiteAdminService, 
    private datePipe: DatePipe
  ) {
    const storedValues = this.getFromSessionStorage(); // Retrieve stored form data from sessionStorage
    
    this.uploadDocumentsForm = this.fb.group({
      paymentId: new FormControl(storedValues.paymentId, [Validators.required, Validators.pattern(PatternConstants.NUMBER)]), // Form control for payment ID
      paymentDate: new FormControl(storedValues.paymentDate, Validators.required), // Form control for payment date
      paymentAmount: new FormControl(storedValues.paymentAmount, [Validators.required, Validators.pattern(PatternConstants.NUMBER)]), // Form control for payment amount
      paymentRemarks: new FormControl(storedValues.paymentRemarks, Validators.maxLength(500)) // Form control for payment remarks
    });

    // Subscribe to form value changes and update sessionStorage accordingly
    this.uploadDocumentsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.saveToSessionStorage(); // Save form data to sessionStorage
      this.updateAllErrorMessages(); // Update error messages
    });
  }

  ngOnDestroy() {
    this.clearStoredFileURLs(); // Clear stored file URLs on component destroy
    this.destroy$.next(); // Complete the destroy subject to unsubscribe
    this.destroy$.complete(); // Complete the destroy subject
  }

  // Retrieve stored payment data from sessionStorage
  private getFromSessionStorage(): Partial<Company> {
    const storedData = sessionStorage.getItem('paymentDetails');
    return storedData ? JSON.parse(storedData) as Company : {}; // Return parsed data or an empty object if nothing is stored
  }

  // Save form data to sessionStorage
  private saveToSessionStorage() {
    const formData = this.uploadDocumentsForm.getRawValue();
    const rawDate = new Date(formData.paymentDate as string);

    if (!isNaN(rawDate.getTime())) { // Check if the date is valid
      formData.paymentDate = this.datePipe.transform(rawDate, 'yyyy-MM-dd')!; // Format the date to 'yyyy-MM-dd'
    }
    sessionStorage.setItem('paymentDetails', JSON.stringify(formData)); // Store the form data in sessionStorage
  }

  // Update error messages for a given form field
  private updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.uploadDocumentsForm.get(field); // Get the form control by field name
    if (control?.hasError('required')) {
      this.errorMessages[field].set('This field is required'); // Set error message if field is required
    } else if (control?.hasError('pattern')) {
      this.errorMessages[field].set('Invalid format'); // Set error message if the field doesn't match the expected pattern
    } else {
      this.errorMessages[field].set(''); // Clear the error message if no errors
    }
  }

  // Update all error messages
  private updateAllErrorMessages() {
    Object.keys(this.errorMessages).forEach((field) => {
      this.updateErrorMessage(field as keyof typeof this.errorMessages); // Update each field's error message
    });
  }

  // Retrieve error message for a specific field
  getErrorMessage(field: keyof typeof this.errorMessages) {
    return this.errorMessages[field](); // Return the error message for the specified field
  }

  // Handle file selection event and store the selected file
  onFileSelect(event: any, document: any) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      document.file = file; // Store the file in the document object
      const fileUrl = URL.createObjectURL(file); // Create a temporary URL for the file
      this.storeFileMetadata(document.key, file, fileUrl); // Store the file metadata
    }
  }

  // Store file metadata in sessionStorage
  private storeFileMetadata(key: keyof CompanyDocuments, file: File, fileUrl: string) {
    const storedDocuments = this.getStoredDocuments(); // Retrieve stored documents
    storedDocuments[key] = fileUrl; // Add the new file URL to the stored documents
    sessionStorage.setItem('companyDocuments', JSON.stringify(storedDocuments)); // Save updated documents to sessionStorage
  }

  // Retrieve stored documents from sessionStorage
  private getStoredDocuments(): Partial<Record<keyof CompanyDocuments, string>> {
    const storedDocs = sessionStorage.getItem('companyDocuments');
    return storedDocs ? JSON.parse(storedDocs) : {}; // Return parsed documents or an empty object if nothing is stored
  }

  // Clear all stored file URLs to free up memory
  private clearStoredFileURLs() {
    const storedDocuments = this.getStoredDocuments(); // Get stored documents
    Object.values(storedDocuments).forEach((fileUrl: string) => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl); // Revoke the object URL to release memory
      }
    });
  }

  // Open the file in a new tab when the 'view' button is clicked
  viewFile(document: any) {
    const storedDocuments = this.getStoredDocuments();
    const fileUrl = storedDocuments[document.key as keyof CompanyDocuments];
    if (fileUrl) {
      window.open(fileUrl, '_blank'); // Open the file URL in a new tab
    }
  }

  // Check if all required documents are uploaded
  areDocumentsUploaded(): boolean {
    const storedDocs = this.getStoredDocuments();
    return this.documents.every(doc => !doc.required || !!storedDocs[doc.key as keyof CompanyDocuments]); // Return true if all required docs are uploaded
  }

  // Trigger the 'back' event to go back to the previous step
  goBack() {
    this.back.emit();
  }

  // Reset the form and clear sessionStorage
  resetForm() {
    this.uploadDocumentsForm.reset(); // Reset the form fields
    sessionStorage.clear(); // Clear sessionStorage
  }

  // Proceed to the next step if the form is valid and all documents are uploaded
  proceedToNext() {
    if (this.uploadDocumentsForm.valid && this.areDocumentsUploaded()) {
      this.next.emit(); // Emit the 'next' event to proceed
    }
  }
}
