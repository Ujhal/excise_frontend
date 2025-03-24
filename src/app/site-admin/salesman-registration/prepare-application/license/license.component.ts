import { Component, EventEmitter, Output, OnInit, DestroyRef } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SiteAdminService } from '../../../site-admin-service';

@Component({
  selector: 'app-license',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './license.component.html',
  styleUrl: './license.component.scss'
})
export class LicenseComponent implements OnInit {
  licenseForm: FormGroup;
  licenseCategories: string[] = [];
  districts: string[] = [];
  licenses: string[] = ['License A', 'License B', 'License C', 'License D'];
  modeofOperations: string[] = ['Salesman', 'Barman'];
  applicationYears: string[] = ['2025-2026'];

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private siteAdminService: SiteAdminService,
    private destroyRef: DestroyRef
  ) {
    this.licenseForm = this.fb.group({
      applicationYear: new FormControl('', [Validators.required]),
      applicationId: new FormControl('', [Validators.required]),
      applicationDate: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      licenseCategory: new FormControl('', [Validators.required]),
      license: new FormControl('', [Validators.required]),
      modeofOperation: new FormControl('', [Validators.required])
    });

    // Load stored data from session storage
    this.loadFromSessionStorage();

    // Listen for form changes and save to session storage
    this.licenseForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.saveToSessionStorage();
    });
  }

  ngOnInit() {
    this.loadLicenseCategories();
    this.loadDistricts();
  }

  loadLicenseCategories(): void {
    this.siteAdminService.getLicenseCategories().subscribe(
      (data) => {
        this.licenseCategories = data.map(category => category.licenseCategoryDescription);
      },
      (error) => {
        console.error('Error fetching license categories:', error);
      }
    );
  }

  loadDistricts(): void {
    this.siteAdminService.getDistrict().subscribe(
      (data) => {
        this.districts = data.map(district => district.District);
      },
      (error) => {
        console.error('Error fetching districts:', error);
      }
    );
  }

  saveToSessionStorage() {
    const formData = this.licenseForm.getRawValue(); // Ensure all values, including disabled ones, are included
    console.log('Saving form data to session:', formData); // Debugging
    sessionStorage.setItem('licenseFormData', JSON.stringify(formData));
  }

  loadFromSessionStorage() {
    const savedData = sessionStorage.getItem('licenseFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('Loading data from session:', parsedData); // Debugging
      this.licenseForm.patchValue(parsedData);
    }
  }

  getErrorMessage(field: string): string {
    const control = this.licenseForm.get(field);
    if (!control) return '';
    
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('minlength')) return 'Minimum length required';
    if (control.hasError('maxlength')) return 'Maximum length exceeded';
    if (control.hasError('pattern')) return 'Invalid format';
    
    return '';
  }

  proceedToNext() {
    if (this.licenseForm.valid) {
      this.saveToSessionStorage(); // Ensure the latest data is saved before proceeding
      this.next.emit();
    } else {
      this.licenseForm.markAllAsTouched(); // Show validation errors if invalid
    }
  }

  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.licenseForm.reset();
    sessionStorage.removeItem('licenseFormData');
  }
}
