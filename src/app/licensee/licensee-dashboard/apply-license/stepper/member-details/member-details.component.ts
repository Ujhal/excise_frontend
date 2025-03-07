import { Component, EventEmitter, Output, ChangeDetectionStrategy, signal } from '@angular/core';
import { MaterialModule } from '../../../../../material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PatternConstants } from '../../../../../config/app.constants';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [
    MaterialModule,
  ],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberDetailsComponent {
  memberDetailsForm: FormGroup;

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  status = new FormControl(this.getFromSessionStorage('status'), [Validators.required]);
  memberName = new FormControl(this.getFromSessionStorage('memberName'), [Validators.required, Validators.pattern(PatternConstants.NAME)]);
  fatherName = new FormControl(this.getFromSessionStorage('fatherName'), [Validators.required, Validators.pattern(PatternConstants.NAME)]);
  nationality = new FormControl(this.getFromSessionStorage('nationality'), [Validators.required]);
  gender = new FormControl(this.getFromSessionStorage('gender'), [Validators.required]);
  pan = new FormControl(this.getFromSessionStorage('pan'), [Validators.required, Validators.pattern(PatternConstants.PAN)]);
  mobileNumber = new FormControl(this.getFromSessionStorage('mobileNumber'), [Validators.required, Validators.pattern(PatternConstants.MOBILE)]);
  emailId = new FormControl(this.getFromSessionStorage('emailId'), [Validators.required, Validators.pattern(PatternConstants.EMAIL)]);
  photo = new FormControl(this.getFromSessionStorage('photo'));

  errorMessages = {
    status: signal(''),
    memberName: signal(''),
    fatherName: signal(''),
    nationality: signal(''),
    gender: signal(''),
    pan: signal(''),
    mobileNumber: signal(''),
    emailId: signal(''),
    photo: signal('')
  };

  statuses: string[] = ['Single', 'Married', 'Divorced'];
  nationalities: string[] = ['Indian', 'Foreign'];

  constructor(private fb: FormBuilder) {
    this.memberDetailsForm = this.fb.group({
      status: this.status,
      memberName: this.memberName,
      fatherName: this.fatherName,
      nationality: this.nationality,
      gender: this.gender,
      pan: this.pan,
      mobileNumber: this.mobileNumber,
      emailId: this.emailId,
    });

    merge(
      this.status.valueChanges,
      this.memberName.valueChanges,
      this.fatherName.valueChanges,
      this.nationality.valueChanges,
      this.gender.valueChanges,
      this.pan.valueChanges,
      this.mobileNumber.valueChanges,
      this.emailId.valueChanges,
      this.photo.valueChanges
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
    sessionStorage.setItem('status', this.status.value || '');
    sessionStorage.setItem('memberName', this.memberName.value || '');
    sessionStorage.setItem('fatherName', this.fatherName.value || '');
    sessionStorage.setItem('nationality', this.nationality.value || '');
    sessionStorage.setItem('gender', this.gender.value || '');
    sessionStorage.setItem('pan', this.pan.value || '');
    sessionStorage.setItem('mobileNumber', this.mobileNumber.value || '');
    sessionStorage.setItem('emailId', this.emailId.value || '');
    sessionStorage.setItem('photo', this.photo.value || '');
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