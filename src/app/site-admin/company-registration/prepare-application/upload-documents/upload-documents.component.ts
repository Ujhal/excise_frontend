import { Component, EventEmitter, Output, signal, inject } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PatternConstants } from '../../../../config/app.constants';
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

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  paymentId = new FormControl(this.getFromSessionStorage('paymentId'), [Validators.required, Validators.pattern(PatternConstants.NUMBER)]);
  paymentDate = new FormControl(this.formatDate(this.getFromSessionStorage('paymentDate')), Validators.required);
  paymentAmount = new FormControl(this.getFromSessionStorage('paymentAmount'), [Validators.required, Validators.pattern(PatternConstants.NUMBER)]);
  paymentRemarks = new FormControl(this.getFromSessionStorage('paymentRemarks'), Validators.maxLength(500));

  errorMessages = {
    paymentId: signal(''),
    paymentDate: signal(''),
    paymentAmount: signal(''),
    paymentRemarks: signal('')
  };

  constructor(private fb: FormBuilder) {
    this.uploadDocumentsForm = this.fb.group({
      paymentId: this.paymentId,
      paymentDate: this.paymentDate,
      paymentAmount: this.paymentAmount,
      paymentRemarks: this.paymentRemarks
    });

    merge(
      this.paymentId.valueChanges,
      this.paymentDate.valueChanges,
      this.paymentAmount.valueChanges,
      this.paymentRemarks.valueChanges
    )
    .pipe(takeUntilDestroyed())
    .subscribe(() => {
      this.saveToSessionStorage();
      this.updateAllErrorMessages();
    });
  }

  getFromSessionStorage(key: string): string {
    return sessionStorage.getItem(key) || '';
  }

  saveToSessionStorage() {
    sessionStorage.setItem('paymentId', this.paymentId.value || '');
    
    // Format the date before saving
    const formattedDate = this.paymentDate.value ? this.formatDate(this.paymentDate.value) : '';
    sessionStorage.setItem('paymentDate', formattedDate);
    

    sessionStorage.setItem('paymentAmount', this.paymentAmount.value || '');
    sessionStorage.setItem('paymentRemarks', this.paymentRemarks.value || '');
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    
    // Convert string to Date object if needed
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    // Format as dd/MM/yyyy
    return this.datePipe.transform(parsedDate, 'dd/MM/yyyy') || '';
  }

  updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this[field];
    if (control.hasError('required')) {
      this.errorMessages[field].set('This field is required');
    } else if (control.hasError('pattern')) {
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
    }
  }

  viewFile(document: any) {
    if (document.file) {
      const fileURL = URL.createObjectURL(document.file);
      window.open(fileURL, '_blank');
    }
  }

  areDocumentsUploaded(): boolean {
    return this.documents.every(doc => !doc.required || doc.file);
  }  

  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.uploadDocumentsForm.reset();
    sessionStorage.clear();
  }
}
