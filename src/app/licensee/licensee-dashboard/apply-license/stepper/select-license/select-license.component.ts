import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LicenseeService } from '../../../../licensee.services';
import { MaterialModule } from '../../../../../material.module';
import { District } from '../../../../../shared/models/district.model';
import { SubDivision } from '../../../../../shared/models/subdivision.model';
import { LicenseCategory } from '../../../../../shared/models/license-category.model';

@Component({
  selector: 'app-select-license',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './select-license.component.html',
  styleUrl: './select-license.component.scss',
})
export class SelectLicenseComponent implements OnInit, OnDestroy{
  selectLicenseForm: FormGroup;
  districts: District[] = [];
  private subDivisions: SubDivision[] = [];
  filteredSubdivisions: any[] = [];
  licenseCategories: LicenseCategory[] = [];
  licenses: string[] = ['New', 'License A', 'License B', 'License C'];

  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  errorMessages = {
    exciseDistrict: signal(''),
    licenseCategory: signal(''),
    exciseSubDivision: signal(''),
    license: signal('')
  };

  constructor(private fb: FormBuilder, private licenseeService: LicenseeService) {
    const storedValues = this.getFromSessionStorage();
    
    this.selectLicenseForm = this.fb.group({
      exciseDistrict: new FormControl(storedValues.exciseDistrict, [Validators.required]),
      licenseCategory: new FormControl(storedValues.licenseCategory, [Validators.required]),
      exciseSubDivision: new FormControl(storedValues.exciseSubDivision, [Validators.required]),
      license: new FormControl(storedValues.license || 'New', [Validators.required]),
    });

    this.selectLicenseForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
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
    this.licenseeService.getDistrict().subscribe((data: District[]) => {
      this.districts = data;
      }, error => {
        console.error('Error fetching districts:', error)
    });

    this.licenseeService.getSubDivision().subscribe((data: SubDivision[]) => {
      this.subDivisions = data;
      }, error => {
        console.error('Failed to load subdivisions.', error);``
    });

    this.licenseeService.getLicenseCategories().subscribe((data: LicenseCategory[]) => {
      this.licenseCategories = data;
      }, error => {
        console.error('Failed to license categories.', error);
    });
  }

  onDistrictChange(name: string): void {
    console.log('Selected District:', name);
    this.filteredSubdivisions = this.subDivisions.filter(subDiv => subDiv.District === name);
    console.log('Filtered Subdivisions:', this.filteredSubdivisions);
  }

  private getFromSessionStorage(): any {
    const storedData = sessionStorage.getItem('selectLicenseDetails');
    return storedData ? JSON.parse(storedData) : {};
  }

  private saveToSessionStorage() {
    const formData = this.selectLicenseForm.getRawValue(); 
    sessionStorage.setItem('selectLicenseDetails', JSON.stringify(formData));
  }

  private updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.selectLicenseForm.get(field);
    if (control?.hasError('required')) {
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
  
  resetForm() {
    this.selectLicenseForm.reset();
    sessionStorage.removeItem('selectLicenseDetails');
  }

  goBack() {
    this.back.emit();
  }
}
