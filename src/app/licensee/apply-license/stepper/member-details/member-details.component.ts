import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LicenseeService } from '../../../licensee.services';
import { MaterialModule } from '../../../../material.module';
import { PatternConstants, FormUtils } from '../../../../config/app.constants';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss',
})
export class MemberDetailsComponent implements OnInit, OnDestroy{
  memberDetailsForm: FormGroup;
  statuses: string[] = ['Single', 'Married', 'Divorced'];
  nationalities: string[] = ['Indian', 'Foreign'];
  
  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  
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
    const storedValues = this.getFromSessionStorage();

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
    })

    this.memberDetailsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.saveToSessionStorage();
        this.updateAllErrorMessages();
      });
  }
  
  ngOnInit() {
    FormUtils.capitalizePAN(this.memberDetailsForm.get('pan')!, this.destroy$);
  }

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
  
  resetForm() {
    this.memberDetailsForm.reset();
    sessionStorage.removeItem('memberDetails');
  }
  
  goBack() {
    this.back.emit();
  }
}