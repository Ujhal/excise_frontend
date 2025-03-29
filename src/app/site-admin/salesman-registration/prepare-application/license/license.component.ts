import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SiteAdminService } from '../../../site-admin-service';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-license',
  imports: [MaterialModule],
  templateUrl: './license.component.html',
  styleUrl: './license.component.scss'
})
export class LicenseComponent implements OnInit, OnDestroy {
  licenseForm: FormGroup;
  licenseCategories: string[] = [];
  districts: string[] = [];
  applicationYears: string[] = ['2025-2026'];
  licenses: string[] = ['New', 'A', 'B', 'C', 'D'];
  modeofOperations: string[] = ['Salesman', 'Barman'];

  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  errorMessages = {
    applicationYear: signal(''),
    applicationId: signal(''),
    applicationDate: signal(''),
    district: signal(''),
    licenseCategory: signal(''),
    license: signal(''),
    modeofOperation: signal('')
  };

  constructor(private fb: FormBuilder, private siteAdminService: SiteAdminService) {
    const storedValues = {
      applicationYear: this.getFromSessionStorage('applicationYear'),
      applicationId: this.getFromSessionStorage('applicationId'),
      applicationDate: this.getFromSessionStorage('applicationDate'),
      district: this.getFromSessionStorage('district'),
      licenseCategory: this.getFromSessionStorage('licenseCategory'),
      license: this.getFromSessionStorage('license') || 'New',
      modeofOperation: this.getFromSessionStorage('modeofOperation'),
    };

    this.licenseForm = this.fb.group({
      applicationYear: new FormControl(storedValues.applicationYear, [Validators.required]),
      applicationId: new FormControl(storedValues.applicationId, [Validators.required]),
      applicationDate: new FormControl(storedValues.applicationDate, [Validators.required]),
      district: new FormControl(storedValues.district, [Validators.required]),
      licenseCategory: new FormControl(storedValues.licenseCategory, [Validators.required]),
      license: new FormControl(storedValues.license || 'New', [Validators.required]),
      modeofOperation: new FormControl(storedValues.modeofOperation, [Validators.required])
    });

    // Auto-save on form changes
    merge(...Object.values(this.licenseForm.controls).map(control => control.valueChanges))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.saveToSessionStorage();
        this.updateAllErrorMessages();
      });
  }

  ngOnInit() {
    this.loadDropdownData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDropdownData(): void {
    this.siteAdminService.getDistrict().subscribe(
      (data) => (this.districts = data.map(d => d.District)),
      (error) => console.error('Error fetching districts:', error)
    );

    this.siteAdminService.getLicenseCategories().subscribe(
      (data) => (this.licenseCategories = data.map(category => category.licenseCategoryDescription)),
      (error) => console.error('Error fetching license categories:', error)
    );
  }

  private getFromSessionStorage(key: string): string {
    return sessionStorage.getItem(key) || '';
  }

  private saveToSessionStorage() {
    Object.keys(this.licenseForm.controls).forEach((key) => {
      sessionStorage.setItem(key, this.licenseForm.get(key)?.value || '');
    });
  }

  private updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.licenseForm.get(field);
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

  proceedToNext() {
    if (this.licenseForm.valid) {
      this.next.emit();
    }
  }

  resetForm() {
    this.licenseForm.reset();
    ['applicationYear', 
      'applicationId', 
      'applicationDate', 
      'district', 
      'licenseCategory', 
      'license', 
      'modeofOperation']
    .forEach((key) => sessionStorage.removeItem(key));
  }

  goBack() {
    this.back.emit();
  }
}
