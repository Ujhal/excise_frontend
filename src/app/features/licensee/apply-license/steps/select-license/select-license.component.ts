import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Services and shared modules
import { LicenseeService } from '../../../licensee.services';
import { MaterialModule } from '../../../../../shared/material.module';

// Models
import { District } from '../../../../../core/models/district.model';
import { SubDivision } from '../../../../../core/models/subdivision.model';
import { LicenseCategory } from '../../../../../core/models/license-category.model';

@Component({
  selector: 'app-select-license',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './select-license.component.html',
  styleUrl: './select-license.component.scss',
})
export class SelectLicenseComponent implements OnInit, OnDestroy {
  // Reactive form instance
  selectLicenseForm: FormGroup;

  // Dropdown data
  districts: District[] = [];
  private subDivisions: SubDivision[] = [];
  filteredSubdivisions: SubDivision[] = [];
  licenseCategories: LicenseCategory[] = [];

  // Static license types
  licenses: string[] = ['New', 'License A', 'License B', 'License C'];

  // Event emitters for navigation
  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  // Used to unsubscribe from observables
  private destroy$ = new Subject<void>();

  // Signal-based error messages
  errorMessages = {
    exciseDistrict: signal(''),
    licenseCategory: signal(''),
    exciseSubDivision: signal(''),
    license: signal('')
  };

  constructor(private fb: FormBuilder, private licenseeService: LicenseeService) {
    // Preload saved data from session storage
    const storedValues = this.getFromSessionStorage();

    // Initialize form group with default or stored values
    this.selectLicenseForm = this.fb.group({
      exciseDistrict: new FormControl(storedValues.exciseDistrict, [Validators.required]),
      licenseCategory: new FormControl(storedValues.licenseCategory, [Validators.required]),
      exciseSubDivision: new FormControl(storedValues.exciseSubDivision, [Validators.required]),
      license: new FormControl(storedValues.license || 'New', [Validators.required]),
    });

    // Save form to session storage on change and update validation messages
    this.selectLicenseForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.saveToSessionStorage();
      this.updateAllErrorMessages();
    });
  }

  // Lifecycle hook - Component init
  ngOnInit() {
    this.loadDropdownData();
  }

  // Lifecycle hook - Cleanup
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Load dropdown values from service
  private loadDropdownData(): void {    
    this.licenseeService.getDistrict().subscribe({
      next: (data: District[]) => this.districts = data,
      error: (error) => console.error('Error fetching districts:', error)
    });

    this.licenseeService.getSubDivision().subscribe({
      next: (data: SubDivision[]) => this.subDivisions = data,
      error: (error) => console.error('Failed to load subdivisions.', error)
    });

    this.licenseeService.getLicenseCategories().subscribe({
      next: (data: LicenseCategory[]) => this.licenseCategories = data,
      error: (error) => console.error('Failed to load license categories.', error)
    });
  }

  // Filter sub-divisions when district changes
  onDistrictChange(name: string): void {
    this.filteredSubdivisions = this.subDivisions.filter(subDiv => subDiv.District === name);
  }

  // Read form data from session storage
  private getFromSessionStorage(): any {
    const storedData = sessionStorage.getItem('selectLicenseDetails');
    return storedData ? JSON.parse(storedData) : {};
  }

  // Save form data to session storage
  private saveToSessionStorage() {
    const formData = this.selectLicenseForm.getRawValue(); 
    sessionStorage.setItem('selectLicenseDetails', JSON.stringify(formData));
  }

  // Update specific field error message
  private updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.selectLicenseForm.get(field);
    if (control?.hasError('required')) {
      this.errorMessages[field].set('This field is required');
    } else {
      this.errorMessages[field].set('');
    }
  }

  // Update all field error messages
  updateAllErrorMessages() {
    Object.keys(this.errorMessages).forEach((field) => {
      this.updateErrorMessage(field as keyof typeof this.errorMessages);
    });
  }

  // Used in template to retrieve error message
  getErrorMessage(field: keyof typeof this.errorMessages) {
    return this.errorMessages[field]();
  }

  // Emit event if form is valid
  proceedToNext() {
    if (this.selectLicenseForm.valid) {
      this.next.emit();
    }
  }
  
  // Reset form and remove saved session data
  resetForm() {
    this.selectLicenseForm.reset();
    sessionStorage.removeItem('selectLicenseDetails');
  }

  // Emit back navigation
  goBack() {
    this.back.emit();
  }
}
