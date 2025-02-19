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

  status = new FormControl(this.getFromLocalStorage('status'), [Validators.required]);
  memberName = new FormControl(this.getFromLocalStorage('memberName'), [Validators.required, Validators.pattern(PatternConstants.NAME)]);
  fatherName = new FormControl(this.getFromLocalStorage('fatherName'), [Validators.required, Validators.pattern(PatternConstants.NAME)]);
  nationality = new FormControl(this.getFromLocalStorage('nationality'), [Validators.required]);
  pan = new FormControl(this.getFromLocalStorage('pan'), [Validators.required, Validators.pattern(PatternConstants.PAN)]);
  mobileNumber = new FormControl(this.getFromLocalStorage('mobileNumber'), [Validators.required, Validators.pattern(PatternConstants.MOBILE)]);
  emailId = new FormControl(this.getFromLocalStorage('emailId'), [Validators.required, Validators.pattern(PatternConstants.EMAIL)]);
  photo = new FormControl(this.getFromLocalStorage('photo'), [Validators.required]);

  errorMessages = {
    status: signal(''),
    memberName: signal(''),
    fatherName: signal(''),
    nationality: signal(''),
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
      pan: this.pan,
      mobileNumber: this.mobileNumber,
      emailId: this.emailId,
      photo: this.photo,
    });

    merge(
      this.status.valueChanges,
      this.memberName.valueChanges,
      this.fatherName.valueChanges,
      this.nationality.valueChanges,
      this.pan.valueChanges,
      this.mobileNumber.valueChanges,
      this.emailId.valueChanges,
      this.photo.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.saveToLocalStorage();
        this.updateAllErrorMessages();
      });
  }

  getFromLocalStorage(key: string): string {
    return localStorage.getItem(key) || '';
  }

  saveToLocalStorage() {
    localStorage.setItem('status', this.status.value || '');
    localStorage.setItem('memberName', this.memberName.value || '');
    localStorage.setItem('fatherName', this.fatherName.value || '');
    localStorage.setItem('nationality', this.nationality.value || '');
    localStorage.setItem('pan', this.pan.value || '');
    localStorage.setItem('mobileNumber', this.mobileNumber.value || '');
    localStorage.setItem('emailId', this.emailId.value || '');
    localStorage.setItem('photo', this.photo.value || '');
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
    localStorage.removeItem('status');
    localStorage.removeItem('memberName');
    localStorage.removeItem('fatherName');
    localStorage.removeItem('nationality');
    localStorage.removeItem('pan');
    localStorage.removeItem('mobileNumber');
    localStorage.removeItem('emailId');
    localStorage.removeItem('photo');
  }
}
