import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LicenseeService } from '../../../licensee.services';
import { MaterialModule } from '../../../../material.module';
import { LicenseType } from '../../../../shared/models/license-type.model';
import { PatternConstants } from '../../../../config/app.constants';

@Component({
  selector: 'app-key-info',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './key-info.component.html',
  styleUrl: './key-info.component.scss',
})
export class KeyInfoComponent implements OnInit, OnDestroy{
  keyInfoForm: FormGroup;
  licenseTypes: LicenseType[] = [];
  licenseNatures: string[] = ['Regular', 'Temporary', 'Seasonal', 'Special Event'];
  functioningStatuses: string[] = ['Yes', 'No'];
  modeofOperations: string[] = ['Self', 'Salesman', 'Barman'];

  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  
  errorMessages = {
    licenseType: signal(''),
    establishmentName: signal(''),
    mobileNumber: signal(''),
    emailId: signal(''),
    licenseNo: signal(''),
    initialGrantDate: signal(''),
    renewedFrom: signal(''),
    validUpTo: signal(''),
    yearlyFee: signal(''),
    licenseNature: signal(''),
    functioningStatus: signal(''),
    modeofOperation: signal('')
  };

  constructor(private fb: FormBuilder, private licenseeService: LicenseeService) {
    const storedValues = this.getFromSessionStorage();

    this.keyInfoForm = this.fb.group({
      licenseType: new FormControl(storedValues.licenseType, [Validators.required]),
      establishmentName: new FormControl(storedValues.establishmentName, [
        Validators.required,
        Validators.maxLength(150),
        Validators.pattern(PatternConstants.ORGANISATION_NAME),
      ]),
      mobileNumber: new FormControl(storedValues.mobileNumber, [Validators.required, Validators.pattern(PatternConstants.MOBILE)]),
      emailId: new FormControl(storedValues.emailId, [Validators.required, Validators.pattern(PatternConstants.EMAIL)]),
      licenseNo: new FormControl(storedValues.licenseNo, [Validators.pattern(PatternConstants.CODE), Validators.maxLength(50)]),
      initialGrantDate: new FormControl(storedValues.initialGrantDate),
      renewedFrom: new FormControl(storedValues.renewedFrom),
      validUpTo: new FormControl(storedValues.validUpTo),
      yearlyFee: new FormControl(storedValues.yearlyFee,[Validators.pattern(PatternConstants.NUMBER)]),
      licenseNature: new FormControl(storedValues.licenseNature, [Validators.required]),
      functioningStatus: new FormControl(storedValues.functioningStatus, [Validators.required]),
      modeofOperation: new FormControl(storedValues.modeofOperation, [Validators.required])
    });

    this.keyInfoForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.saveToSessionStorage();
        this.updateAllErrorMessages();
      });
  }

  ngOnInit() {
    this.loadDropdownData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDropdownData(): void {    
    this.licenseeService.getLicenseTypes().subscribe((data: LicenseType[]) => {
      this.licenseTypes = data;
      }, error => {
        console.error('Failed to load license types.', error);
    });
  }

  private getFromSessionStorage(): any {
    const storedData = sessionStorage.getItem('keyInfoDetails');
    return storedData ? JSON.parse(storedData) : {};
  }

  private saveToSessionStorage() {
    const formData = this.keyInfoForm.getRawValue(); 
    sessionStorage.setItem('keyInfoDetails', JSON.stringify(formData));
  }

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

  updateAllErrorMessages() {
    Object.keys(this.errorMessages).forEach((field) => {
      this.updateErrorMessage(field as keyof typeof this.errorMessages);
    });
  }

  getErrorMessage(field: keyof typeof this.errorMessages) {
    return this.errorMessages[field]();
  }

  proceedToNext() {
    if (this.keyInfoForm.valid) {
      this.next.emit();
    }
  }

  resetForm() {
    this.keyInfoForm.reset();
    sessionStorage.removeItem('keyInfoDetails');
  }

  goBack() {
    this.back.emit();
  }
}