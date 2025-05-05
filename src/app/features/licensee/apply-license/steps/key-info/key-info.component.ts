import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LicenseeService } from '../../../licensee.services';
import { MaterialModule } from '../../../../../shared/material.module';
import { LicenseType } from '../../../../../core/models/license-type.model';
import { PatternConstants } from '../../../../../shared/constants/pattern.constants';
import { LicenseApplication } from '../../../../../core/models/license-application.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-key-info',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './key-info.component.html',
  styleUrl: './key-info.component.scss',
  providers: [DatePipe]
})
export class KeyInfoComponent implements OnInit, OnDestroy {

  // Reactive form group
  keyInfoForm: FormGroup;

  // Dropdown options
  licenseTypes: LicenseType[] = [];
  licenseNatures: string[] = ['Regular', 'Temporary', 'Seasonal', 'Special Event'];
  functioningStatuses: string[] = ['Yes', 'No'];
  modeofOperations: string[] = ['Self', 'Salesman', 'Barman'];

  // Emit navigation events to parent component
  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  // Used for unsubscribing from observables
  private destroy$ = new Subject<void>();

  // Signal-based error messages for reactive display
  errorMessages = {
    licenseType: signal(''),
    establishmentName: signal(''),
    mobileNumber: signal(''),
    emailId: signal(''),
    licenseNo: signal(''),
    initialGrantDate: signal(''),
    renewedFrom: signal(''),
    validUpTo: signal(''),
    yearlyLicenseFee: signal(''),
    licenseNature: signal(''),
    functioningStatus: signal(''),
    modeofOperation: signal('')
  };

  constructor(
    private fb: FormBuilder,
    private licenseeService: LicenseeService,
    private datePipe: DatePipe
  ) {
    // Retrieve data from session storage if available
    const storedValues = this.getFromSessionStorage();

    // Initialize reactive form with validation
    this.keyInfoForm = this.fb.group({
      licenseType: new FormControl(storedValues.licenseType, [Validators.required]),
      establishmentName: new FormControl(storedValues.establishmentName, [
        Validators.required,
        Validators.maxLength(150),
        Validators.pattern(PatternConstants.ORGANISATION_NAME),
      ]),
      mobileNumber: new FormControl(storedValues.mobileNumber, [
        Validators.required,
        Validators.pattern(PatternConstants.MOBILE)
      ]),
      emailId: new FormControl(storedValues.emailId, [
        Validators.required,
        Validators.pattern(PatternConstants.EMAIL)
      ]),
      licenseNo: new FormControl(storedValues.licenseNo, [
        Validators.pattern(PatternConstants.CODE),
        Validators.maxLength(50)
      ]),
      initialGrantDate: new FormControl(storedValues.initialGrantDate),
      renewedFrom: new FormControl(storedValues.renewedFrom),
      validUpTo: new FormControl(storedValues.validUpTo),
      yearlyLicenseFee: new FormControl(storedValues.yearlyLicenseFee, [
        Validators.pattern(PatternConstants.NUMBER)
      ]),
      licenseNature: new FormControl(storedValues.licenseNature, [Validators.required]),
      functioningStatus: new FormControl(storedValues.functioningStatus, [Validators.required]),
      modeofOperation: new FormControl(storedValues.modeofOperation, [Validators.required])
    });

    // Subscribe to form changes to update session storage and errors
    this.keyInfoForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.saveToSessionStorage();
        this.updateAllErrorMessages();
      });
  }

  ngOnInit() {
    // Load license type dropdown data on init
    this.loadDropdownData();
  }

  ngOnDestroy() {
    // Cleanup observable subscription
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Load data for License Type dropdown from service
  private loadDropdownData(): void {
    this.licenseeService.getLicenseTypes().subscribe(
      (data: LicenseType[]) => {
        this.licenseTypes = data;
      },
      error => {
        console.error('Failed to load license types.', error);
      }
    );
  }

  // Fetch form values from session storage if available
  private getFromSessionStorage(): Partial<LicenseApplication> {
    const storedData = sessionStorage.getItem('keyInfoData');
    return storedData ? JSON.parse(storedData) as LicenseApplication : {};
  }

  // Save form values to session storage on change
  private saveToSessionStorage() {
    const formData: Partial<LicenseApplication> = this.keyInfoForm.getRawValue();
    const rawInitialGrantDate = new Date(formData.initialGrantDate as string);
    const rawRenewedFrom = new Date(formData.renewedFrom as string);
    const rawValidUpTo = new Date(formData.validUpTo as string);

    if (!isNaN(rawInitialGrantDate.getTime())) {
      formData.initialGrantDate = this.datePipe.transform(rawInitialGrantDate, 'yyyy-MM-dd')!;
    }
    if (!isNaN(rawRenewedFrom.getTime())) {
      formData.renewedFrom = this.datePipe.transform(rawRenewedFrom, 'yyyy-MM-dd')!;
    }
    if (!isNaN(rawValidUpTo.getTime())) {
      formData.validUpTo = this.datePipe.transform(rawValidUpTo, 'yyyy-MM-dd')!;
    }
    
    sessionStorage.setItem('keyInfoData', JSON.stringify(formData));
  }

  // Update the error message of a specific form control
  private updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.keyInfoForm.get(field);
    if (control?.hasError('required')) {
      this.errorMessages[field].set('This field is required');
    } else if (control?.hasError('pattern')) {
      this.errorMessages[field].set('Invalid format');
    } else {
      this.errorMessages[field].set('');
    }
  }

  // Update all error messages for all form fields
  private updateAllErrorMessages() {
    Object.keys(this.errorMessages).forEach((field) => {
      this.updateErrorMessage(field as keyof typeof this.errorMessages);
    });
  }

  // Retrieve error message for a specific field
  getErrorMessage(field: keyof typeof this.errorMessages) {
    return this.errorMessages[field]();
  }

  // Emit event to proceed to next step if form is valid
  proceedToNext() {
    if (this.keyInfoForm.valid) {
      this.next.emit();
    }
  }

  // Reset form and remove session data
  resetForm() {
    this.keyInfoForm.reset();
    sessionStorage.removeItem('keyInfoData');
  }

  // Emit event to go back to the previous step
  goBack() {
    this.back.emit();
  }
}
