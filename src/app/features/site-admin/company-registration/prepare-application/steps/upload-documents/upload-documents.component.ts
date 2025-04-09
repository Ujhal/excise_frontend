import { Component, EventEmitter, Output, OnDestroy, signal, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SiteAdminService } from '../../../../site-admin-service';
import { PatternConstants } from '../../../../../../shared/constants/app.constants';
import { MaterialModule } from '../../../../../../shared/material.module';
import { DatePipe } from '@angular/common';
import { Company, CompanyDocuments } from '../../../../../../core/models/company.model';

@Component({
  selector: 'app-upload-documents',
  imports: [MaterialModule],
  templateUrl: './upload-documents.component.html',
  styleUrl: './upload-documents.component.scss',
  providers: [DatePipe] 
})
export class UploadDocumentsComponent implements OnDestroy{
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
  
  displayedColumns: string[] = ['serialNo', 'docType', 'upload', 'view'];
  documents = [
    { key: 'undertaking', name: 'An Undertaking stating that they shall abide by the condition of the Certificate or registration and the provision of Sikkim Excise Act 1992 and rules, regulations and orders made thereunder', 
      format: 'pdf, png, jpg', accept: '.pdf,.png,.jpg', required: true, file: null },
  ];

  constructor(
    private fb: FormBuilder, 
    private siteAdminService: SiteAdminService,
    private datePipe: DatePipe) {
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
    this.clearStoredFileURLs();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getFromSessionStorage(): Partial<Company> {
    const storedData = sessionStorage.getItem('paymentDetails');
    return storedData ? JSON.parse(storedData) as Company : {};
  }

  private saveToSessionStorage() {
    const formData = this.uploadDocumentsForm.getRawValue();
    const rawDate = new Date(formData.paymentDate as string);

    if (!isNaN(rawDate.getTime())) {
      formData.paymentDate = this.datePipe.transform(rawDate, 'yyyy-MM-dd')!;
    }
    sessionStorage.setItem('paymentDetails', JSON.stringify(formData));
  }

  private updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.uploadDocumentsForm.get(field);
    if (control?.hasError('required')) {
      this.errorMessages[field].set('This field is required');
    } else if (control?.hasError('pattern')) {
      this.errorMessages[field].set('Invalid format');
    } else {
      this.errorMessages[field].set('');
    }
  }

  private updateAllErrorMessages() {
    Object.keys(this.errorMessages).forEach((field) => {
      this.updateErrorMessage(field as keyof typeof this.errorMessages);
    });
  }

  getErrorMessage(field: keyof typeof this.errorMessages) {
    return this.errorMessages[field]();
  }


  onFileSelect(event: any, document: any) {
    const file = event.target.files[0];
    if (file) {
      document.file = file;
      const fileUrl = URL.createObjectURL(file);
      this.storeFileMetadata(document.key, file, fileUrl);
    }
  }

  private storeFileMetadata(key: keyof CompanyDocuments, file: File, fileUrl: string) {
    const storedDocuments = this.getStoredDocuments();
    storedDocuments[key] = fileUrl;
    sessionStorage.setItem('companyDocuments', JSON.stringify(storedDocuments));
  }  

  private getStoredDocuments(): Partial<Record<keyof CompanyDocuments, string>> {
    const storedDocs = sessionStorage.getItem('companyDocuments');
    return storedDocs ? JSON.parse(storedDocs) : {};
  }

  private clearStoredFileURLs() {
    const storedDocuments = this.getStoredDocuments();
    Object.values(storedDocuments).forEach((fileUrl: string) => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    });
  }

  viewFile(document: any) {
    const storedDocuments = this.getStoredDocuments();
    const fileUrl = storedDocuments[document.key as keyof CompanyDocuments];
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }  

  areDocumentsUploaded(): boolean {
    const storedDocs = this.getStoredDocuments();
    return this.documents.every(doc => !doc.required || !!storedDocs[doc.key as keyof CompanyDocuments]);
  }

  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.uploadDocumentsForm.reset();
    sessionStorage.clear();
  }

  proceedToNext() {
    if (this.uploadDocumentsForm.valid && this.areDocumentsUploaded()) {
      this.next.emit();
    }
  }
}
