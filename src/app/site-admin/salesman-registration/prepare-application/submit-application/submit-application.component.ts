import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-submit-application',
  imports: [MaterialModule],
  templateUrl: './submit-application.component.html',
  styleUrl: './submit-application.component.scss'
})
export class SubmitApplicationComponent {
  submitForm: FormGroup;

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    this.submitForm = this.fb.group({
    });
  }

  get licenseDetails() {
    return this.getEntries([
      'applicationYear', 'applicationId', 'applicationDate',
      'district', 'licenseCategory', 'license', 'modeofOperation'
    ]);
  }

  get modeofOperation() {
    return sessionStorage.getItem('modeofOperation') || 'Default';
  }
  
  get details() {
    return this.getEntries([
      'firstName', 'middleName', 'lastName', 'fatherName',
      'gender', 'dob', 'nationality', 'address',
      'pan', 'aadhaar', 'mobileNumber', 'emailId'
    ]);
  }

  private getEntries(keys: string[]) {
    return keys
      .map(key => ({
        key: this.formatKey(key), 
        value: sessionStorage.getItem(key) || ''
      }))
      .filter(entry => entry.value !== ''); // Remove empty values if needed
  }
  
  private formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1') 
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
  
    
  proceedToNext() {
    if (this.submitForm.valid) {
      this.next.emit();
    }
  }

  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.submitForm.reset();
    sessionStorage.clear();
  }
}
