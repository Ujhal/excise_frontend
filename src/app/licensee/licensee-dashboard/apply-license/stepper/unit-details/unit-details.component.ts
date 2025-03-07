import { Component, EventEmitter, Output,  ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../material.module';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PatternConstants } from '../../../../../config/app.constants';

@Component({
  selector: 'app-unit-details',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './unit-details.component.html',
  styleUrl: './unit-details.component.scss'
})
export class UnitDetailsComponent {
  unitDetailsForm: FormGroup;

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  companyName = new FormControl(this.getFromSessionStorage('companyName'), [Validators.required, Validators.pattern(PatternConstants.NAME)]);
  companyAddress = new FormControl(this.getFromSessionStorage('companyAddress'), [Validators.required]);
  companyPan = new FormControl(this.getFromSessionStorage('companyPan'), [Validators.required, Validators.pattern(PatternConstants.PAN)]);
  companyCin = new FormControl(this.getFromSessionStorage('companyCin'), [Validators.required]);
  incorporationDate = new FormControl(this.getFromSessionStorage('incorporationDate'));
  phoneNumber = new FormControl(this.getFromSessionStorage('phoneNumber'), [Validators.required, Validators.pattern(PatternConstants.MOBILE)]);
  emailId = new FormControl(this.getFromSessionStorage('emailId'), [Validators.required, Validators.pattern(PatternConstants.EMAIL)]);



  errorMessages = {
    companyName: signal(''),
    companyAddress: signal(''),
    companyPan: signal(''),
    companyCin: signal(''),
    incorporationDate: signal(''),
    phoneNumber: signal(''),
    emailId: signal(''),
  };

  constructor(private fb: FormBuilder) {
    this.unitDetailsForm = this.fb.group({
      companyName: this.companyName,
      companyAddress: this.companyAddress,
      companyPan: this.companyPan,
      companyCin: this.companyCin,
      incorporationDate: this.incorporationDate,
      phoneNumber: this.phoneNumber,
      emailId: this.emailId,
    });

    merge(this.companyName.valueChanges,
      this.companyAddress.valueChanges,
      this.companyPan.valueChanges,
      this.companyCin.valueChanges,
      this.incorporationDate.valueChanges,
      this.phoneNumber.valueChanges,
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
    sessionStorage.setItem('companyName', this.companyName.value || '');
    sessionStorage.setItem('companyAddress', this.companyAddress.value || '');
    sessionStorage.setItem('companyPan', this.companyPan.value || '');
    sessionStorage.setItem('companyCin', this.companyCin.value || '');
    sessionStorage.setItem('incorporationDate', this.incorporationDate.value || '');
    sessionStorage.setItem('phoneNumber', this.phoneNumber.value || '');
    sessionStorage.setItem('emailId', this.emailId.value || '');
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

  get licenseType() {
    return sessionStorage.getItem('licenseType');
  }

  isIndividual() {
    return this.licenseType === 'Individual';
  } 

  isCompany() {
    return this.licenseType === 'Company';
  }

  proceedToNext() {
    if (this.isIndividual() ||this.unitDetailsForm.valid) {
      this.next.emit();
    }
  }

  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.unitDetailsForm.reset();
  }
}