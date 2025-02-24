import { Component, EventEmitter, Output, ChangeDetectionStrategy, signal } from '@angular/core';
import { MaterialModule } from '../../../../../material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-select-license',
  standalone: true,
  imports: [
    MaterialModule,
  ],
  templateUrl: './select-license.component.html',
  styleUrl: './select-license.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectLicenseComponent {
  selectLicenseForm: FormGroup;

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  exciseDistrict = new FormControl(this.getFromLocalStorage('exciseDistrict'), [Validators.required]);
  licenseCategory = new FormControl(this.getFromLocalStorage('licenseCategory'), [Validators.required]);
  exciseSubDivision = new FormControl(this.getFromLocalStorage('exciseSubDivision'), [Validators.required]);
  licenseSelection = new FormControl(this.getFromLocalStorage('licenseSelection'), [Validators.required]);

  errorMessages = {
    exciseDistrict: signal(''),
    licenseCategory: signal(''),
    exciseSubDivision: signal(''),
    licenseSelection: signal(''),
  };

   // Initial dropdown options
   exciseDistricts: string[] = ['District A', 'District B'];
   licenseCategories: string[] = ['Category A', 'Category B'];
   exciseSubDivisions: string[] = ['Sub Division A', 'Sub Division B'];
   licenseSelections: string[] = ['Selections A', 'Selections B'];

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
        this.saveToLocalStorage();
        this.updateAllErrorMessages();
      });
  }

  getFromLocalStorage(key: string): string {
    return localStorage.getItem(key) || '';
  }

  saveToLocalStorage() {
    localStorage.setItem('exciseDistrict', this.exciseDistrict.value || '');
    localStorage.setItem('licenseCategory', this.licenseCategory.value || '');
    localStorage.setItem('exciseSubDivision', this.exciseSubDivision.value || '');
    localStorage.setItem('licenseSelection', this.licenseSelection.value || '');
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
    localStorage.removeItem('exciseDistrict');
    localStorage.removeItem('licenseCategory');
    localStorage.removeItem('exciseSubDivision');
    localStorage.removeItem('licenseSelection');
  }
}
