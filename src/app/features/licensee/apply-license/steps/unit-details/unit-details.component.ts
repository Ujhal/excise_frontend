import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MaterialModule } from '../../../../../shared/material.module';
import { PatternConstants } from '../../../../../shared/constants/pattern.constants';
import { FormUtils } from '../../../../../shared/utils/pan.util';

@Component({
  selector: 'app-unit-details',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './unit-details.component.html',
  styleUrl: './unit-details.component.scss'
})
export class UnitDetailsComponent implements OnInit, OnDestroy {
  
  // Reactive form for unit/company details
  unitDetailsForm: FormGroup;

  // Emit events to go to the next or previous step in the stepper
  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  // Used to unsubscribe from observables on destroy
  private destroy$ = new Subject<void>();

  // Signal-based error message store for each form field
  errorMessages = {
    companyName: signal(''),
    companyAddress: signal(''),
    companyPan: signal(''),
    companyCin: signal(''),
    incorporationDate: signal(''),
    companyPhoneNumber: signal(''),
    emailId: signal(''),
  };

  constructor(private fb: FormBuilder) {
    // Retrieve session-stored form data if available
    const storedValues = this.getFromSessionStorage();
    
    // Initialize the form with validation and pre-filled session values
    this.unitDetailsForm = this.fb.group({
      companyName: new FormControl(storedValues.companyName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      companyAddress: new FormControl(storedValues.companyAddress, [Validators.required]),
      companyPan: new FormControl(storedValues.companyPan, [Validators.required, Validators.pattern(PatternConstants.PAN)]),
      companyCin: new FormControl(storedValues.companyCin, [Validators.required]),
      incorporationDate: new FormControl(storedValues.incorporationDate, [Validators.required]),
      companyPhoneNumber: new FormControl(storedValues.companyPhoneNumber, [Validators.required, Validators.pattern(PatternConstants.MOBILE)]),
      emailId: new FormControl(storedValues.emailId, [Validators.required, Validators.pattern(PatternConstants.EMAIL)])
    });

    // Save to session storage and update error messages on form change
    this.unitDetailsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.saveToSessionStorage();
      this.updateAllErrorMessages();
    });
  }

  // Lifecycle hook to perform operations after component loads
  ngOnInit() {
    // Automatically capitalize PAN field value as user types
    FormUtils.capitalizePAN(this.unitDetailsForm.get('companyPan')!, this.destroy$);
  }

  // Lifecycle hook to clean up subscriptions
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Retrieves stored form values from sessionStorage
  private getFromSessionStorage(): any {
    const storedData = sessionStorage.getItem('unitDetails');
    return storedData ? JSON.parse(storedData) : {};
  }

  // Stores current form data into sessionStorage
  private saveToSessionStorage() {
    const formData = this.unitDetailsForm.getRawValue(); 
    sessionStorage.setItem('unitDetails', JSON.stringify(formData));
  }

  // Sets an error message for a specific field based on its validation state
  private updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.unitDetailsForm.get(field);
    if (control?.hasError('required')) {
      this.errorMessages[field].set('This field is required');
    } else if (control?.hasError('pattern')) {
      this.errorMessages[field].set('Invalid format');
    } else {
      this.errorMessages[field].set('');
    }
  }

  // Updates all error messages for all form fields
  updateAllErrorMessages() {
    Object.keys(this.errorMessages).forEach((field) => {
      this.updateErrorMessage(field as keyof typeof this.errorMessages);
    });
  }

  // Returns current error message for a given field
  getErrorMessage(field: keyof typeof this.errorMessages) {
    return this.errorMessages[field]();
  }

  // Emits the next event if the form is valid
  proceedToNext() {
    if (this.unitDetailsForm.valid) {
      this.next.emit();
    }
  }

  // Resets the form and clears session data
  resetForm() {
    this.unitDetailsForm.reset();
    sessionStorage.removeItem('unitDetails');
  }

  // Emits the back event
  goBack() {
    this.back.emit();
  }
}
