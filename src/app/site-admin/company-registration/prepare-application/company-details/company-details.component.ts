import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SiteAdminService } from '../../../site-admin-service';
import { MaterialModule } from '../../../../material.module';
import { PatternConstants, FormUtils } from '../../../../config/app.constants';

@Component({
  selector: 'app-company-details',
  imports: [MaterialModule],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
  companyDetailsForm: FormGroup;
  licenses: string[] = ['New', 'A', 'B', 'C', 'D'];
  applicationYears: string[] = ['2025-2026'];
  countries: string[] = ['India', 'Nepal', 'Bhutan', 'China'];
  states: string[] = ['Sikkim', 'West Bengal', 'Bihar', 'Assam'];
  
  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  
  errorMessages = {
    brandType: signal(''),
    license: signal(''),
    applicationYear: signal(''),
    companyName: signal(''),
    pan: signal(''),
    officeAddress: signal(''),
    country: signal(''),
    state: signal(''),
    factoryAddress: signal(''),
    pinCode: signal(''),
    mobileNumber: signal(''),
    emailId: signal(''),
  };

  constructor(private fb: FormBuilder, private siteAdminService: SiteAdminService) {
    const storedValues = this.getFromSessionStorage();

    this.companyDetailsForm = this.fb.group({
      brandType: new FormControl(storedValues.brandType, [Validators.required]),
      license: new FormControl(storedValues.license, Validators.required),
      applicationYear: new FormControl(storedValues.applicationYear, Validators.required),
      companyName: new FormControl(storedValues.companyName, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      pan: new FormControl(storedValues.pan, [Validators.pattern(PatternConstants.PAN)]),
      officeAddress: new FormControl(storedValues.officeAddress, [Validators.required, Validators.maxLength(1000)]),
      country: new FormControl(storedValues.country, [Validators.required, Validators.pattern(PatternConstants.NAME)]),
      state: new FormControl(storedValues.state, [Validators.required]),
      factoryAddress: new FormControl(storedValues.factoryAddress, [Validators.required, Validators.maxLength(500)]),
      pinCode: new FormControl(storedValues.pinCode, [Validators.required, Validators.pattern(PatternConstants.PINCODE)]),
      mobileNumber: new FormControl(storedValues.mobileNumber, [Validators.required, Validators.pattern(PatternConstants.MOBILE)]),
      emailId: new FormControl(storedValues.emailId, [Validators.pattern(PatternConstants.EMAIL)])
    });

    this.companyDetailsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.saveToSessionStorage();
        this.updateAllErrorMessages();
      });
  }

  ngOnInit() {
    FormUtils.capitalizePAN(this.companyDetailsForm.get('pan')!, this.destroy$);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private getFromSessionStorage(): any {
    const storedData = sessionStorage.getItem('companyDetails');
    return storedData ? JSON.parse(storedData) : {};
  }

  private saveToSessionStorage() {
    const formData = this.companyDetailsForm.getRawValue();
    sessionStorage.setItem('companyDetails', JSON.stringify(formData));
  }

  private updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.companyDetailsForm.get(field);
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
    if (this.companyDetailsForm.valid) {
      this.next.emit();
    }
  }
  
  resetForm() {
    this.companyDetailsForm.reset();
    sessionStorage.removeItem('companyDetails');
  }

  goBack() {
    this.back.emit();
  }
}
