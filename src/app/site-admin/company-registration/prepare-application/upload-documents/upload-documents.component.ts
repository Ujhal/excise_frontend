import { Component, EventEmitter, Output, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SiteAdminService } from '../../../site-admin-service';
import { PatternConstants, FormUtils } from '../../../../config/app.constants';
import { MaterialModule } from '../../../../material.module';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-upload-documents',
  imports: [MaterialModule],
  templateUrl: './upload-documents.component.html',
  styleUrl: './upload-documents.component.scss',
  providers: [DatePipe] // Provide DatePipe
})
export class UploadDocumentsComponent {
  private datePipe = inject(DatePipe); // Inject DatePipe

  uploadDocumentsForm: FormGroup;

  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  errorMessages = {
    paymentId: signal(''),
    paymentDate: signal(''),
    paymentAmount: signal(''),
    paymentRemarks: signal('')
  };
  
  constructor(private fb: FormBuilder, private siteAdminService: SiteAdminService) {
    const storedValues = this.getFromSessionStorage();
    
    this.uploadDocumentsForm = this.fb.group({
      paymentId: new FormControl(storedValues.paymentId, [Validators.required, Validators.pattern(PatternConstants.NUMBER)]),
      paymentDate: new FormControl(storedValues.paymentDate, Validators.required),
      paymentAmount: new FormControl(storedValues.paymentAmount, [Validators.required, Validators.pattern(PatternConstants.NUMBER)]),
      paymentRemarks: new FormControl(storedValues.paymentRemarks, Validators.maxLength(500))
    })

    this.uploadDocumentsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.saveToSessionStorage();
      this.updateAllErrorMessages();
    });
  }

  ngOnDestroy() {
    const storedDocuments = this.getStoredDocuments();
    Object.values(storedDocuments).forEach((doc: any) => {
      if (doc.fileUrl) {
        URL.revokeObjectURL(doc.fileUrl);
      }
    });
    this.destroy$.next();
    this.destroy$.complete();
  }


  private getFromSessionStorage(): any {
    const storedData = sessionStorage.getItem('paymentDetails');
    const storedDocuments = this.getStoredDocuments();

    // Restore file metadata
    this.documents.forEach(doc => {
      if (storedDocuments[doc.name]) {
        doc.file = storedDocuments[doc.name]; // Restore file metadata
      }
    });
    return storedData ? JSON.parse(storedData) : {};
  }

  private saveToSessionStorage() {
    const formData = this.uploadDocumentsForm.getRawValue(); // Ensures all values are captured
    sessionStorage.setItem('paymentDetails', JSON.stringify(formData));
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    // Convert string to Date object if needed
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    // Format as dd/MM/yyyy
    return this.datePipe.transform(parsedDate, 'dd/MM/yyyy') || '';
  }

  updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.uploadDocumentsForm.get(field);
    if (control?.hasError('required')) {
      this.errorMessages[field].set('This field is required');
    } else if (control?.hasError('pattern')) {
      this.errorMessages[field].set('Invalid format');
    } else {
      this.errorMessages[field].set('');
    }
  }

  updateAllErrorMessages() {
    Object.keys(this.errorMessages).forEach((field) => {
      this.updateErrorMessage(field as keyof typeof this.errorMessages);
    });
  }

  getErrorMessage(field: keyof typeof this.errorMessages) {
    return this.errorMessages[field]();
  }

  displayedColumns: string[] = ['serialNo', 'docType', 'upload', 'view'];

  documents = [
    { name: 'An Undertaking stating that they shall abide by the condition of the Certificate or registration and the provision of Sikkim Excise Act 1992 and rules, regulations and orders made thereunder', 
      format: 'pdf, png, jpg', accept: '.pdf,.png,.jpg', required: true, file: null },
  ];

  onFileSelect(event: any, document: any) {
    const file = event.target.files[0];
    if (file) {
      document.file = file;
  
      // Create a URL for the uploaded file
      const fileUrl = URL.createObjectURL(file);
  
      // Store file metadata + URL in sessionStorage
      const storedDocuments = this.getStoredDocuments();
      storedDocuments[document.name] = {
        name: file.name,
        type: file.type,
        size: file.size,
        fileUrl: fileUrl
      };
  
      sessionStorage.setItem('companyDocuments', JSON.stringify(storedDocuments));
    }
  }

  private getStoredDocuments(): any {
    const storedDocs = sessionStorage.getItem('companyDocuments');
    return storedDocs ? JSON.parse(storedDocs) : {};
  }

  viewFile(document: any) {
    const storedDocuments = this.getStoredDocuments();
    const docInfo = storedDocuments[document.name];
  
    if (docInfo?.fileUrl) {
      window.open(docInfo.fileUrl, '_blank');
    } else {
      console.warn("File not found in sessionStorage");
    }
  }

  areDocumentsUploaded(): boolean {
    return this.documents.every(doc => !doc.required || this.getStoredDocuments()[doc.name]);
  }  

  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.uploadDocumentsForm.reset();
    sessionStorage.clear();
  }

  submit(){}
}
