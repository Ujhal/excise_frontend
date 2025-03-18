import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PatternConstants } from '../../../../config/app.constants';

@Component({
  selector: 'app-details',
  imports: [MaterialModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {

  get modeofOperation() {
    return sessionStorage.getItem('modeofOperation');
  }

  isSalesman() {
    return this.modeofOperation === 'Salesman';
  } 

  isBarman() {
    return this.modeofOperation === 'Barman';
  }

  detailsForm: FormGroup;
  
    @Output() next = new EventEmitter<void>();
    @Output() back = new EventEmitter<void>();
  
    firstName = new FormControl(this.getFromSessionStorage('firstName'), [Validators.required, Validators.pattern(PatternConstants.NAME)]);
    middleName = new FormControl(this.getFromSessionStorage('middleName'), [Validators.pattern(PatternConstants.NAME)]);
    lastName = new FormControl(this.getFromSessionStorage('lastName'), [Validators.required, Validators.pattern(PatternConstants.NAME)]);
    fatherName = new FormControl(this.getFromSessionStorage('fatherName'), [Validators.required, Validators.pattern(PatternConstants.NAME)]);
    gender = new FormControl(this.getFromSessionStorage('gender'), [Validators.required]);
    dob = new FormControl(this.getFromSessionStorage('dob'), [Validators.required]);
    nationality = new FormControl(this.getFromSessionStorage('nationality'), [Validators.required]);
    address = new FormControl(this.getFromSessionStorage('address'), [Validators.required]);
    pan = new FormControl(this.getFromSessionStorage('pan'), [Validators.pattern(PatternConstants.PAN)]);
    aadhaar = new FormControl(this.getFromSessionStorage('aadhaar'), [Validators.required, Validators.pattern(PatternConstants.AADHAAR_NUMBER)]);
    mobileNumber = new FormControl(this.getFromSessionStorage('mobileNumber'), [Validators.required, Validators.pattern(PatternConstants.MOBILE)]);
    emailId = new FormControl(this.getFromSessionStorage('emailId'), [Validators.pattern(PatternConstants.EMAIL)]);
    sikkimSubject = new FormControl(this.getFromSessionStorage('sikkimSubject'));

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
  
    nationalities: string[] = ['Indian', 'Foreign'];
  
    constructor(private fb: FormBuilder) {
      this.detailsForm = this.fb.group({
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        fatherName: this.fatherName,
        gender: this.gender,
        dob: this.dob,
        nationality: this.nationality,
        address: this.address,
        pan: this.pan,
        aadhaar: this.aadhaar,
        mobileNumber: this.mobileNumber,
        emailId: this.emailId,
        sikkimSubject: this.sikkimSubject,
      });
  
      merge(
        this.firstName.valueChanges,
        this.middleName.valueChanges,
        this.lastName.valueChanges,
        this.fatherName.valueChanges,
        this.gender.valueChanges,
        this.dob.valueChanges,
        this.nationality.valueChanges,
        this.address.valueChanges,
        this.pan.valueChanges,
        this.aadhaar.valueChanges,
        this.mobileNumber.valueChanges,
        this.emailId.valueChanges,
        this.sikkimSubject.valueChanges
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
      sessionStorage.setItem('firstName', this.firstName.value || '');
      sessionStorage.setItem('middleName', this.middleName.value || '');
      sessionStorage.setItem('lastName', this.lastName.value || '');
      sessionStorage.setItem('fatherName', this.fatherName.value || '');
      sessionStorage.setItem('gender', this.gender.value || '');
      sessionStorage.setItem('dob', this.dob.value || '');
      sessionStorage.setItem('nationality', this.nationality.value || '');   
      sessionStorage.setItem('address', this.address.value || '');
      sessionStorage.setItem('pan', this.pan.value || '');
      sessionStorage.setItem('aadhaar', this.aadhaar.value || '');
      sessionStorage.setItem('mobileNumber', this.mobileNumber.value || '');
      sessionStorage.setItem('emailId', this.emailId.value || '');
      sessionStorage.setItem('sikkimSubject', this.sikkimSubject.value ? 'true' : 'false');
    }
  
    updateErrorMessage(field: keyof typeof this.errorMessages) {
      const control = this[field];
      if (control.hasError('required')) {
        this.errorMessages[field].set('This field is required');
      } else if (control.hasError('pattern')) {
        this.errorMessages[field].set('Invalid format');
      } else if (control.hasError('email')) {
        this.errorMessages[field].set('Not a valid email');
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
  
    goBack() {
      this.back.emit();
    }
  
    resetForm() {
      this.detailsForm.reset();
      sessionStorage.clear();
    }
}
