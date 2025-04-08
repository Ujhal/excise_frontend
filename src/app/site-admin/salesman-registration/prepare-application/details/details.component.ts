import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SiteAdminService } from '../../../site-admin-service';
import { PatternConstants, FormUtils } from '../../../../config/app.constants';
import { MaterialModule } from '../../../../material.module';
import { SalesmanBarman, SalesmanBarmanDocuments } from '../../../../shared/models/salesman-barman.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [MaterialModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  providers: [DatePipe]
})
export class DetailsComponent implements OnInit, OnDestroy {
  detailsForm: FormGroup;
  nationalities: string[] = ['Indian', 'Foreign'];
  
  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  errorMessages = {
    firstName: signal(''),
    middleName: signal(''),
    lastName: signal(''),
    fatherHusbandName: signal(''),
    gender: signal(''),
    dob: signal(''),
    nationality: signal(''),
    address: signal(''),
    pan: signal(''),
    aadhaar: signal(''),
    mobileNumber: signal(''),
    emailId: signal(''),
    sikkimSubject: signal('')
  };

  displayedColumns: string[] = ['serialNo', 'docType', 'upload', 'view'];
  documents = [
    { key: 'passPhoto', name: 'Passport Size Photo', format: 'png, jpg, jpeg', accept: '.png,.jpg,.jpeg', required: true, file: null },
    { key: 'aadhaarCard', name: 'Aadhaar card', format: 'pdf', accept: '.pdf', required: true, file: null },
    { key: 'residentialCertificate', name: 'Sikkim Subject Certificate/ Certificate of Identification / Residential Certificate', format: 'pdf', accept: '.pdf', required: true, file: null },
    { key: 'dateofBirthProof', name: 'Date of Birth proof', format: 'pdf', accept: '.pdf', required: true, file: null }
  ];

  constructor(
    private fb: FormBuilder, 
    private siteAdminService: SiteAdminService,
    private datePipe: DatePipe) {
    const storedValues = this.getFromSessionStorage();

    this.detailsForm = this.fb.group({
      firstName: new FormControl(storedValues.firstName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      middleName: new FormControl(storedValues.middleName, [Validators.pattern(PatternConstants.NAME)]),
      lastName: new FormControl(storedValues.lastName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      fatherHusbandName: new FormControl(storedValues.fatherHusbandName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      gender: new FormControl(storedValues.gender, [Validators.required]),
      dob: new FormControl(storedValues.dob, [Validators.required]),
      nationality: new FormControl(storedValues.nationality, [Validators.required]),
      address: new FormControl(storedValues.address, [Validators.required]),
      pan: new FormControl(storedValues.pan, [Validators.required, Validators.pattern(PatternConstants.PAN)]),
      aadhaar: new FormControl(storedValues.aadhaar, [Validators.required, Validators.pattern(PatternConstants.AADHAAR_NUMBER)]),
      mobileNumber: new FormControl(storedValues.mobileNumber, [Validators.required, Validators.pattern(PatternConstants.MOBILE)]),
      emailId: new FormControl(storedValues.emailId, [Validators.pattern(PatternConstants.EMAIL)]),
      sikkimSubject: new FormControl(storedValues.sikkimSubject, [Validators.required])
    });

    this.detailsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.saveToSessionStorage();
      this.updateAllErrorMessages();
    });
  }

  ngOnInit() {
    FormUtils.capitalizePAN(this.detailsForm.get('pan')!, this.destroy$);
  }

  ngOnDestroy() {
    this.clearStoredFileURLs();
    this.destroy$.next();
    this.destroy$.complete();
  }

  get modeofOperation() {
    const storedData = sessionStorage.getItem('licenseDetails');
    return storedData ? JSON.parse(storedData).modeofOperation : null;
  }

  private getFromSessionStorage(): Partial<SalesmanBarman> {
    const storedData = sessionStorage.getItem('personDetails');
    return storedData ? JSON.parse(storedData) as SalesmanBarman : {};
  }

  private saveToSessionStorage() {
    const formData: Partial<SalesmanBarman> = this.detailsForm.getRawValue();
    const rawDate = new Date(formData.dob as string);

    if (!isNaN(rawDate.getTime())) {
      formData.dob = this.datePipe.transform(rawDate, 'yyyy-MM-dd')!;
    }
    sessionStorage.setItem('personDetails', JSON.stringify(formData));
  }

  private updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.detailsForm.get(field);
    if (control?.hasError('required')) {
      this.errorMessages[field].set('This field is required');
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

  private storeFileMetadata(key: keyof SalesmanBarmanDocuments, file: File, fileUrl: string) {
    const storedDocuments = this.getStoredDocuments();
    storedDocuments[key] = fileUrl;
    sessionStorage.setItem('salesmanBarmanDocuments', JSON.stringify(storedDocuments));
  }  

  private getStoredDocuments(): Partial<Record<keyof SalesmanBarmanDocuments, string>> {
    const storedDocs = sessionStorage.getItem('salesmanBarmanDocuments');
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
    const fileUrl = storedDocuments[document.key as keyof SalesmanBarmanDocuments];
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }  

  areDocumentsUploaded(): boolean {
    const storedDocs = this.getStoredDocuments();
    return this.documents.every(doc => !doc.required || !!storedDocs[doc.key as keyof SalesmanBarmanDocuments]);
  }
  
  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.detailsForm.reset();
    sessionStorage.removeItem('personDetails');
    this.clearStoredFileURLs();
  }
  
  proceedToNext() {
    if (this.detailsForm.valid && this.areDocumentsUploaded()) {
      this.next.emit();
    }
  }

}
