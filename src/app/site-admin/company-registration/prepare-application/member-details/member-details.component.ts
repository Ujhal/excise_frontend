import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MaterialModule } from '../../../../material.module';
import { PatternConstants } from '../../../../config/app.constants';

@Component({
  selector: 'app-member-details',
  imports: [MaterialModule],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss'
})
export class MemberDetailsComponent {
  memberDetailsForm: FormGroup;
  
  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  
  errorMessages = {
    memberName: signal(''),
    memberDesignation: signal(''),
    mobileNumber: signal(''),
    emailId: signal(''),
    memberAddress: signal(''),
  };
  
  constructor(private fb: FormBuilder) {
    const storedValues = this.getFromSessionStorage();

    this.memberDetailsForm = this.fb.group({
      memberName: new FormControl(storedValues.memberName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      memberDesignation:new FormControl(storedValues.memberDesignation, [Validators.required, Validators.maxLength(100)]),
      mobileNumber: new FormControl(storedValues.mobileNumber, [Validators.required, Validators.pattern(PatternConstants.MOBILE)]),
      emailId: new FormControl(storedValues.emailId, [Validators.pattern(PatternConstants.EMAIL)]),
      memberAddress: new FormControl(storedValues.memberAddress, [Validators.required, Validators.maxLength(500)])
    });

    this.memberDetailsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.saveToSessionStorage();
        this.updateAllErrorMessages();
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }  

  private getFromSessionStorage(): any {
    const storedData = sessionStorage.getItem('memberDetails');
    return storedData ? JSON.parse(storedData) : {};
  }

  private saveToSessionStorage() {
    const formData = this.memberDetailsForm.getRawValue();
    sessionStorage.setItem('memberDetails', JSON.stringify(formData));
  }

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

  private updateAllErrorMessages() {
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
  
  resetForm() {
    this.memberDetailsForm.reset();
    sessionStorage.removeItem('memberDetails');
  }

  goBack() {
    this.back.emit();
  }
}
