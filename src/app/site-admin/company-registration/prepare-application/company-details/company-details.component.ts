import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PatternConstants } from '../../../../config/app.constants';

@Component({
  selector: 'app-company-details',
  imports: [MaterialModule],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent {
  companyDetailsForm: FormGroup;
  
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  brandType = new FormControl(this.getFromSessionStorage('brandType'), [Validators.required]);
  license = new FormControl(this.getFromSessionStorage('license'), Validators.required);
  applicationYear = new FormControl(this.getFromSessionStorage('applicationYear'), Validators.required);
  companyName = new FormControl(this.getFromSessionStorage('companyName'), [Validators.required, Validators.pattern(PatternConstants.NAME)]);
  pan = new FormControl(this.getFromSessionStorage('pan'), [Validators.pattern(PatternConstants.PAN)]);
  officeAddress = new FormControl(this.getFromSessionStorage('officeAddress'), [Validators.required, Validators.maxLength(1000)]);
  country = new FormControl(this.getFromSessionStorage('country'), [Validators.required, Validators.pattern(PatternConstants.NAME)]);
  state = new FormControl(this.getFromSessionStorage('state'), [Validators.required]);
  factoryAddress = new FormControl(this.getFromSessionStorage('factoryAddress'), [Validators.required, Validators.maxLength(500)]);
  pinCode = new FormControl(this.getFromSessionStorage('pinCode'), [Validators.required, Validators.pattern(PatternConstants.PINCODE)]);
  mobileNumber = new FormControl(this.getFromSessionStorage('mobileNumber'), [Validators.required, Validators.pattern(PatternConstants.MOBILE)]);
  emailId = new FormControl(this.getFromSessionStorage('emailId'), [Validators.pattern(PatternConstants.EMAIL)]);

  errorMessages = {
    brandType: signal(''),
    license: signal(''),
    applicationYear: signal(''),
    companyName: signal(''),
    pan: signal(''),
    officeAddress: signal(''),
    country: signal(''),
    state: signal(''),
    factoryAddress: signal(''),
    pinCode: signal(''),
    mobileNumber: signal(''),
    emailId: signal(''),
  };

  licenses: string[] = ['License A', 'License B', 'License C', 'License D'];
  applicationYears: string[] = ['2025-2026'];
  countries: string[] = ['India', 'Nepal', 'Bhutan', 'China'];
  states: string[] = ['Sikkim', 'West Bengal', 'Bihar', 'Assam'];
  
  constructor(private fb: FormBuilder) {
    this.companyDetailsForm = this.fb.group({
      brandType: this.brandType,
      license: this.license,
      applicationYear: this.applicationYear,
      companyName: this.companyName,
      pan: this.pan,
      officeAddress: this.officeAddress,
      country: this.country,
      state: this.state,
      factoryAddress: this.factoryAddress,
      pinCode: this.pinCode,
      mobileNumber: this.mobileNumber,
      emailId: this.emailId,
    });

    merge(
      this.brandType.valueChanges,
      this.license.valueChanges,
      this.applicationYear.valueChanges,
      this.companyName.valueChanges,
      this.pan.valueChanges,
      this.officeAddress.valueChanges,
      this.country.valueChanges,
      this.state.valueChanges,
      this.factoryAddress.valueChanges,
      this.pinCode.valueChanges,
      this.mobileNumber.valueChanges,
      this.emailId.valueChanges,
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
    sessionStorage.setItem('brandType', this.brandType.value || '');
    sessionStorage.setItem('license', this.license.value || '');
    sessionStorage.setItem('applicationYear', this.applicationYear.value || '');
    sessionStorage.setItem('companyName', this.companyName.value || '');
    sessionStorage.setItem('pan', this.pan.value || '');
    sessionStorage.setItem('officeAddress', this.officeAddress.value || '');
    sessionStorage.setItem('country', this.country.value || '');
    sessionStorage.setItem('state', this.state.value || '');
    sessionStorage.setItem('factoryAddress', this.factoryAddress.value || '');   
    sessionStorage.setItem('pinCode', this.pinCode.value || '');
    sessionStorage.setItem('mobileNumber', this.mobileNumber.value || '');
    sessionStorage.setItem('emailId', this.emailId.value || '');
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

  proceedToNext() {
    if (this.companyDetailsForm.valid) {
      this.next.emit();
    }
  }

  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.companyDetailsForm.reset();
    sessionStorage.clear();
  }
}
