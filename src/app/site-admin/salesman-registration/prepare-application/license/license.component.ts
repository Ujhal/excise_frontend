import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-license',
  imports: [MaterialModule],
  templateUrl: './license.component.html',
  styleUrl: './license.component.scss'
})
export class LicenseComponent {
  licenseForm: FormGroup;

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  applicationYear = new FormControl(this.getFromSessionStorage('applicationYear'), [Validators.required]);
  applicationId = new FormControl(this.getFromSessionStorage('applicationId'), [Validators.required]);
  applicationDate = new FormControl(this.getFromSessionStorage('applicationDate'), [Validators.required]);
  district = new FormControl(this.getFromSessionStorage('district'), [Validators.required]);
  licenseCategory = new FormControl(this.getFromSessionStorage('licenseCategory'), [Validators.required]);
  license = new FormControl(this.getFromSessionStorage('license'), [Validators.required]);
  modeofOperation = new FormControl(this.getFromSessionStorage('modeofOperation'), [Validators.required]);

  errorMessages = {
    applicationYear: signal(''),
    applicationId: signal(''),
    applicationDate: signal(''),
    district: signal(''),
    licenseCategory: signal(''),
    license: signal(''),
    modeofOperation: signal('')
  };

  // Initial dropdown options
  applicationYears: string[] = ['2025-2026'];
  districts: string[] = ['Gangtok', 'Namchi', 'Mangan', 'Pakyong', 'Gyalshing', 'Soreng'];
  licenseCategories: string[] = [
    'Bar License exclusively for Homemade Wine',
    'Brewery',
    'Bar-cum-Hotel & Lodge',
    'Casino with Bar',
    'Departmental Store'
  ];
  licenses: string[] = ['License A', 'License B', 'License C', 'License D'];
  modeofOperations: string[] = ['Salesman', 'Barman'];

  constructor(private fb: FormBuilder) {
    this.licenseForm = this.fb.group({
      applicationYear: this.applicationYear,
      applicationId: this.applicationId,
      applicationDate: this.applicationDate,
      district: this.district,
      licenseCategory: this.licenseCategory,
      license: this.license,
      modeofOperation: this.modeofOperation
    });

    merge(
      this.applicationYear.valueChanges,
      this.applicationId.valueChanges,
      this.applicationDate.valueChanges,
      this.district.valueChanges,
      this.licenseCategory.valueChanges,
      this.license.valueChanges,
      this.modeofOperation.valueChanges
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
    sessionStorage.setItem('applicationYear', this.applicationYear.value || '');
    sessionStorage.setItem('applicationId', this.applicationId.value || '');
    sessionStorage.setItem('applicationDate', this.applicationDate.value || '');
    sessionStorage.setItem('district', this.district.value || '');
    sessionStorage.setItem('licenseCategory', this.licenseCategory.value || '');
    sessionStorage.setItem('license', this.license.value || '');
    sessionStorage.setItem('modeofOperation', this.modeofOperation.value || '');
  }

  updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this[field];
    if (control.hasError('required')) {
      this.errorMessages[field].set('This field is required');
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
    if (this.licenseForm.valid) {
      this.next.emit();
    }
  }

  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.licenseForm.reset();
    sessionStorage.clear();
  }
}
