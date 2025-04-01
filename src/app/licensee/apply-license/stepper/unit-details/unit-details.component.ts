import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MaterialModule } from '../../../../material.module';
import { PatternConstants, FormUtils } from '../../../../config/app.constants';

@Component({
  selector: 'app-unit-details',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './unit-details.component.html',
  styleUrl: './unit-details.component.scss'
})
export class UnitDetailsComponent implements OnInit, OnDestroy{
  unitDetailsForm: FormGroup;

  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

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
    const storedValues = this.getFromSessionStorage();
    
    this.unitDetailsForm = this.fb.group({
      companyName: new FormControl(storedValues.companyName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      companyAddress: new FormControl(storedValues.companyAddress, [Validators.required]),
      companyPan: new FormControl(storedValues.companyPan, [Validators.required, Validators.pattern(PatternConstants.PAN)]),
      companyCin: new FormControl(storedValues.companyCin, [Validators.required]),
      incorporationDate: new FormControl(storedValues.incorporationDate, [Validators.required]),
      companyPhoneNumber: new FormControl(storedValues.companyPhoneNumber, [Validators.required, Validators.pattern(PatternConstants.MOBILE)]),
      emailId: new FormControl(storedValues.emailId, [Validators.required, Validators.pattern(PatternConstants.EMAIL)])
    })

    this.unitDetailsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.saveToSessionStorage();
        this.updateAllErrorMessages();
      });
  }  
  
  ngOnInit() {
    FormUtils.capitalizePAN(this.unitDetailsForm.get('companyPan')!, this.destroy$);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getFromSessionStorage(): any {
    const storedData = sessionStorage.getItem('unitDetails');
    return storedData ? JSON.parse(storedData) : {};
  }

  private saveToSessionStorage() {
    const formData = this.unitDetailsForm.getRawValue(); 
    sessionStorage.setItem('unitDetails', JSON.stringify(formData));
  }

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

  updateAllErrorMessages() {
    Object.keys(this.errorMessages).forEach((field) => {
      this.updateErrorMessage(field as keyof typeof this.errorMessages);
    });
  }

  getErrorMessage(field: keyof typeof this.errorMessages) {
    return this.errorMessages[field]();
  }

  proceedToNext() {
    if (this.unitDetailsForm.valid) {
      this.next.emit();
    }
  }

  resetForm() {
    this.unitDetailsForm.reset();
    sessionStorage.removeItem('unitDetails');
  }
 
  goBack() {
    this.back.emit();
  }
}