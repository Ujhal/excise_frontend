// Angular core imports
import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Services and shared modules
import { LicenseeService } from '../../../licensee.services';
import { MaterialModule } from '../../../../../shared/material.module';
import { PatternConstants } from '../../../../../shared/constants/app.constants';
import { FormUtils } from '../../../../../shared/utils/pan.util';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss',
})
export class MemberDetailsComponent implements OnInit, OnDestroy {
  // Reactive form instance
  memberDetailsForm: FormGroup;

  // Static dropdown values
  statuses: string[] = ['Single', 'Married', 'Divorced'];
  nationalities: string[] = ['Indian', 'Foreign'];
  
  // Event emitters for navigation
  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  // Subject for unsubscribing observables
  private destroy$ = new Subject<void>();

  // Signal-based error messages for each form control
  errorMessages = {
    status: signal(''),
    memberName: signal(''),
    fatherHusbandName: signal(''),
    nationality: signal(''),
    gender: signal(''),
    pan: signal(''),
    mobileNumber: signal(''),
    emailId: signal(''),
    photo: signal('')
  };

  constructor(private fb: FormBuilder, private licenseeService: LicenseeService) {
    // Load saved form data from sessionStorage (if available)
    const storedValues = this.getFromSessionStorage();

    // Initialize the form with validations and pre-filled values
    this.memberDetailsForm = this.fb.group({
      status: new FormControl(storedValues.status, [Validators.required]),
      memberName: new FormControl(storedValues.memberName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      fatherHusbandName: new FormControl(storedValues.fatherHusbandName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      nationality: new FormControl(storedValues.nationality, [Validators.required]),
      gender: new FormControl(storedValues.gender, [Validators.required]),
      pan: new FormControl(storedValues.pan, [Validators.required, Validators.pattern(PatternConstants.PAN)]),
      mobileNumber: new FormControl(storedValues.mobileNumber, [Validators.required, Validators.pattern(PatternConstants.MOBILE)]),
      emailId: new FormControl(storedValues.emailId, [Validators.required, Validators.pattern(PatternConstants.EMAIL)]),
      photo: new FormControl(storedValues.photo),
    });

    // Subscribe to form value changes to update error messages and save form data to sessionStorage
    this.memberDetailsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.saveToSessionStorage();
        this.updateAllErrorMessages();
      });
  }

  // Initialize PAN formatting utility on component load
  ngOnInit() {
    FormUtils.capitalizePAN(this.memberDetailsForm.get('pan')!, this.destroy$);
  }

  // Clean up observables on component destroy
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Retrieve stored form data from sessionStorage
  private getFromSessionStorage(): any {
    const storedData = sessionStorage.getItem('memberDetails');
    return storedData ? JSON.parse(storedData) : {};
  }

  // Save current form data to sessionStorage
  private saveToSessionStorage() {
    const formData = this.memberDetailsForm.getRawValue(); 
    sessionStorage.setItem('memberDetails', JSON.stringify(formData));
  }

  // Set error messages based on control validation errors
  private updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.memberDetailsForm.get(field);
    if (control?.hasError('required')) {
      this.errorMessages[field].set('This field is required');
    } else if (control?.hasError('pattern')) {
      this.errorMessages[field].set('Invalid format');
    } else if (control?.hasError('email')) {
      this.errorMessages[field].set('Not a valid email');
    } else {
      this.errorMessages[field].set('');
    }
  }

  // Update all error messages at once (called on value changes)
  updateAllErrorMessages() {
    Object.keys(this.errorMessages).forEach((field) => {
      this.updateErrorMessage(field as keyof typeof this.errorMessages);
    });
  }

  // Get current error message for a form control
  getErrorMessage(field: keyof typeof this.errorMessages) {
    return this.errorMessages[field]();
  }

  // Proceed to next step if the form is valid
  proceedToNext() {
    if (this.memberDetailsForm.valid) {
      this.next.emit();
    }
  }

  // Reset the form and clear saved session data
  resetForm() {
    this.memberDetailsForm.reset();
    sessionStorage.removeItem('memberDetails');
  }

  // Go back to the previous step
  goBack() {
    this.back.emit();
  }
}
