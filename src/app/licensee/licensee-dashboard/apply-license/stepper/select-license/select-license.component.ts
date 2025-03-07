import { Component, EventEmitter, Output, ChangeDetectionStrategy, signal } from '@angular/core';
import { MaterialModule } from '../../../../../material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardModule } from '@coreui/angular';

@Component({
  selector: 'app-select-license',
  standalone: true,
  imports: [MaterialModule, CardModule],
  templateUrl: './select-license.component.html',
  styleUrl: './select-license.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectLicenseComponent {
  selectLicenseForm: FormGroup;

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  exciseDistrict = new FormControl(this.getFromSessionStorage('exciseDistrict'), [Validators.required]);
  licenseCategory = new FormControl(this.getFromSessionStorage('licenseCategory'), [Validators.required]);
  exciseSubDivision = new FormControl(this.getFromSessionStorage('exciseSubDivision'), [Validators.required]);
  licenseSelection = new FormControl(this.getFromSessionStorage('licenseSelection'), [Validators.required]);

  errorMessages = {
    exciseDistrict: signal(''),
    licenseCategory: signal(''),
    exciseSubDivision: signal(''),
    licenseSelection: signal('')
  };

  // Initial dropdown options
  exciseDistricts: string[] = ['Gangtok', 'Gyalshing', 'Mangan', 'Namchi'];
  licenseCategories: string[] = [
    'Bar License exclusively for Homemade Wine',
    'Brewery',
    'Bar-cum-Hotel & Lodge',
    'Casino with Bar',
    'Departmental Store'
  ];
  licenseSelections: string[] = ['License A', 'License B', 'License C'];

  districtSubdivisions: { [key: string]: string[] } = {
    Gangtok: ['Ranka', 'Ranipool', 'Rumtek'],
    Namchi: ['Sadam', 'Namthang', 'Damthang'],
    Gyalshing: ['Yuksom', 'Dentam'],
    Mangan: ['Chungthang', 'Dzongu']
  };

  constructor(private fb: FormBuilder) {
    this.selectLicenseForm = this.fb.group({
      exciseDistrict: this.exciseDistrict,
      licenseCategory: this.licenseCategory,
      exciseSubDivision: this.exciseSubDivision,
      licenseSelection: this.licenseSelection
    });

    merge(
      this.exciseDistrict.valueChanges,
      this.licenseCategory.valueChanges,
      this.exciseSubDivision.valueChanges,
      this.licenseSelection.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.saveToSessionStorage();
        this.updateAllErrorMessages();
      });

    // Reset subdivision when district changes
    this.exciseDistrict.valueChanges.subscribe(() => {
      this.exciseSubDivision.setValue('');
    });
  }

  get exciseSubDivisions(): string[] {
    return this.districtSubdivisions[this.exciseDistrict.value || ''] || [];
  }

  getFromSessionStorage(key: string): string {
    return sessionStorage.getItem(key) || '';
  }

  saveToSessionStorage() {
    sessionStorage.setItem('exciseDistrict', this.exciseDistrict.value || '');
    sessionStorage.setItem('licenseCategory', this.licenseCategory.value || '');
    sessionStorage.setItem('exciseSubDivision', this.exciseSubDivision.value || '');
    sessionStorage.setItem('licenseSelection', this.licenseSelection.value || '');
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
    if (this.selectLicenseForm.valid) {
      this.next.emit();
    }
  }

  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.selectLicenseForm.reset();
    sessionStorage.clear();
  }
}
