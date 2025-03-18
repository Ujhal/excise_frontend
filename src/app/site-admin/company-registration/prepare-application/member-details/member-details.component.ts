import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PatternConstants } from '../../../../config/app.constants';

@Component({
  selector: 'app-member-details',
  imports: [MaterialModule],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss'
})
export class MemberDetailsComponent {
  memberDetailsForm: FormGroup;
  
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  memberName = new FormControl(this.getFromSessionStorage('memberName'), [Validators.required, Validators.pattern(PatternConstants.NAME)]);
  memberDesignation = new FormControl(this.getFromSessionStorage('memberDesignation'), [Validators.required, Validators.maxLength(100)]);
  mobileNumber = new FormControl(this.getFromSessionStorage('mobileNumber'), [Validators.required, Validators.pattern(PatternConstants.MOBILE)]);
  emailId = new FormControl(this.getFromSessionStorage('emailId'), [Validators.pattern(PatternConstants.EMAIL)]);
  memberAddress = new FormControl(this.getFromSessionStorage('memberAddress'), [Validators.required, Validators.maxLength(500)]);

  errorMessages = {
    memberName: signal(''),
    memberDesignation: signal(''),
    mobileNumber: signal(''),
    emailId: signal(''),
    memberAddress: signal(''),
  };
  
  constructor(private fb: FormBuilder) {
    this.memberDetailsForm = this.fb.group({
      memberName: this.memberName,
      memberDesignation: this.memberDesignation,
      mobileNumber: this.mobileNumber,
      emailId: this.emailId,
      memberAddress: this.memberAddress,
    });

    merge(
      this.memberName.valueChanges,
      this.memberDesignation.valueChanges,
      this.mobileNumber.valueChanges,
      this.emailId.valueChanges,
      this.memberAddress.valueChanges,
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
    sessionStorage.setItem('memberName', this.memberName.value || '');
    sessionStorage.setItem('memberDesignation', this.memberDesignation.value || '');
    sessionStorage.setItem('mobileNumber', this.mobileNumber.value || '');
    sessionStorage.setItem('emailId', this.emailId.value || '');
  }

  updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this[field];
    if (control.hasError('required')) {
      this.errorMessages[field].set('This field is required');
    } else if (control.hasError('pattern')) {
      this.errorMessages[field].set('Invalid format');
    } else if (control.hasError('email')) {
      this.errorMessages[field].set('Not a valid email');
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
    if (this.memberDetailsForm.valid) {
      this.next.emit();
    }
  }

  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.memberDetailsForm.reset();
    sessionStorage.clear();
  }
}
