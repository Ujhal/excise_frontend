import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SiteAdminService } from '../../../site-admin-service';
import { PatternConstants } from '../../../../config/app.constants';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-details',
  imports: [MaterialModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy{
  detailsForm: FormGroup;
  nationalities: string[] = ['Indian', 'Foreign'];
  
  get modeofOperation() {
    return sessionStorage.getItem('modeofOperation');
  }
  
  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  errorMessages = {
    firstName: signal(''),
    middleName: signal(''),
    lastName: signal(''),
    fatherName: signal(''),
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

  constructor(private fb: FormBuilder, private siteAdminService: SiteAdminService) {
    const storedValues = {
      firstName: this.getFromSessionStorage('firstName'),
      middleName: this.getFromSessionStorage('middleName'),
      lastName: this.getFromSessionStorage('lastName'),
      fatherName: this.getFromSessionStorage('fatherName'),
      gender: this.getFromSessionStorage('gender'),
      dob: this.getFromSessionStorage('dob'),
      nationality: this.getFromSessionStorage('nationality'),
      address: this.getFromSessionStorage('address'),
      pan: this.getFromSessionStorage('pan'),
      aadhaar: this.getFromSessionStorage('aadhaar'),
      mobileNumber: this.getFromSessionStorage('mobileNumber'),
      emailId: this.getFromSessionStorage('emailId'),
      sikkimSubject: this.getFromSessionStorage('sikkimSubject'),
    };
    this.detailsForm = this.fb.group({
      firstName: new FormControl(storedValues.firstName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      middleName: new FormControl(storedValues.middleName, [Validators.pattern(PatternConstants.NAME)]),
      lastName: new FormControl(storedValues.lastName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      fatherName: new FormControl(storedValues.fatherName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      gender: new FormControl(storedValues.gender, [Validators.required]),
      dob: new FormControl(storedValues.dob, [Validators.required]),
      nationality: new FormControl(storedValues.nationality, [Validators.required]),
      address: new FormControl(storedValues.address, [Validators.required]),
      pan: new FormControl(storedValues.pan, [Validators.pattern(PatternConstants.PAN)]),
      aadhaar: new FormControl(storedValues.aadhaar, [Validators.required, Validators.pattern(PatternConstants.AADHAAR_NUMBER)]),
      mobileNumber: new FormControl(storedValues.mobileNumber, [Validators.required, Validators.pattern(PatternConstants.MOBILE)]),
      emailId: new FormControl(storedValues.emailId, [Validators.pattern(PatternConstants.EMAIL)]),
      sikkimSubject: new FormControl(storedValues.sikkimSubject, [Validators.required])
    });

    this.detailsForm.get('pan')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(value => {
      if (value) {
        this.detailsForm.get('pan')?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });

    // Auto-save on form changes
    merge(...Object.values(this.detailsForm.controls).map(control => control.valueChanges))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.saveToSessionStorage();
        this.updateAllErrorMessages();
      });
  }
  
  ngOnInit() {}
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private getFromSessionStorage(key: string): string {
    return sessionStorage.getItem(key) || '';
  }

  private saveToSessionStorage() {
    Object.keys(this.detailsForm.controls).forEach((key) => {
      sessionStorage.setItem(key, this.detailsForm.get(key)?.value || '');
    });
  }
  
  private updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.detailsForm.get(field);
    if (control?.hasError('required')) {
      this.errorMessages[field].set('This field is required');
    } else if (control?.hasError('pattern')) {
      this.errorMessages[field].set('Invalid format');
    } else if (control?.hasError('email')) {
      this.errorMessages[field].set('Not a valid email');
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

    displayedColumns: string[] = ['serialNo', 'docType', 'upload', 'view'];

    documents = [
      { name: 'Passport Size Photo', format: 'png, jpg, jpeg', accept: '.png,.jpg,.jpeg', required: true, file: null },
      { name: 'Aadhaar card', format: 'pdf', accept: '.pdf', required: true, file: null },
      { name: 'Sikkim Subject Certificate/ Certificate of Identification / Residential Certificate', format: 'pdf', accept: '.pdf', required: true, file: null },
      { name: 'Date of Birth proof', format: 'pdf', accept: '.pdf', required: true, file: null }
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
  
    proceedToNext() {
      if (this.detailsForm.valid && this.areDocumentsUploaded()) {
        this.next.emit();
      }
    }
    
    resetForm() {
      this.detailsForm.reset();
      ['firstName', 
        'middleName', 
        'lastName', 
        'fatherName', 
        'gender', 
        'dob',
        'nationality',
        'address',
        'pan',
        'aadhaar',
        'mobileNumber',
        'emailId',
        'sikkimSubject']
      .forEach((key) => sessionStorage.removeItem(key));
    }

    goBack() {
      this.back.emit();
    } 
}
