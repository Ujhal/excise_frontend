import { Component, EventEmitter, Output, ChangeDetectionStrategy, signal } from '@angular/core';
import { MaterialModule } from '../../../../../material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PatternConstants } from '../../../../../config/app.constants';

@Component({
  selector: 'app-key-info',
  standalone: true,
  imports: [
    MaterialModule,
  ],
  templateUrl: './key-info.component.html',
  styleUrl: './key-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyInfoComponent {
  keyInfoForm: FormGroup;

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  licenseType = new FormControl(this.getFromSessionStorage('licenseType'), [Validators.required]);
  establishmentName = new FormControl(this.getFromSessionStorage('establishmentName'), [
    Validators.required,
    Validators.maxLength(150),
    Validators.pattern(PatternConstants.ORGANISATION_NAME),
  ]);
  mobileNumber = new FormControl(this.getFromSessionStorage('mobileNumber'), [Validators.required, Validators.pattern(PatternConstants.MOBILE)]);
  licenseNo = new FormControl(this.getFromSessionStorage('licenseNo'), [Validators.pattern(PatternConstants.CODE), Validators.maxLength(50)]);
  initialGrantDate = new FormControl(this.getFromSessionStorage('initialGrantDate'));
  renewedFrom = new FormControl(this.getFromSessionStorage('renewedFrom'));
  validUpTo = new FormControl(this.getFromSessionStorage('validUpTo'));
  yearlyFee = new FormControl(this.getFromSessionStorage('yearlyFee'), [Validators.pattern(PatternConstants.NUMBER)]);
  licenseNature = new FormControl(this.getFromSessionStorage('licenseNature'), [Validators.required]);
  functioningStatus = new FormControl(this.getFromSessionStorage('functioningStatus'), [Validators.required]);
  modeofOperation = new FormControl(this.getFromSessionStorage('modeofOperation'), [Validators.required]);

  errorMessages = {
    licenseType: signal(''),
    establishmentName: signal(''),
    mobileNumber: signal(''),
    licenseNo: signal(''),
    yearlyFee: signal(''),
    licenseNature: signal(''),
    functioningStatus: signal(''),
    modeofOperation: signal('')
  };

  licenseTypes: string[] = ['Individual', 'Company'];
  licenseNatures: string[] = ['Regular', 'Temporary', 'Seasonal', 'Special Event'];
  functioningStatuses: string[] = ['Yes', 'No'];
  modeofOperations: string[] = ['Self', 'Salesman', 'Barman'];

  constructor(private fb: FormBuilder) {
    this.keyInfoForm = this.fb.group({
      licenseType: this.licenseType,
      establishmentName: this.establishmentName,
      mobileNumber: this.mobileNumber,
      licenseNo: this.licenseNo,
      initialGrantDate: this.initialGrantDate,
      renewedFrom: this.renewedFrom,
      validUpTo: this.validUpTo,
      yearlyFee: this.yearlyFee,
      licenseNature: this.licenseNature,
      functioningStatus: this.functioningStatus,
      modeofOperation: this.modeofOperation
    });

    merge(
      this.licenseType.valueChanges,
      this.establishmentName.valueChanges,
      this.mobileNumber.valueChanges,
      this.licenseNo.valueChanges,
      this.yearlyFee.valueChanges,
      this.licenseNature.valueChanges,
      this.functioningStatus.valueChanges,
      this.modeofOperation.valueChanges
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
    sessionStorage.setItem('licenseType', this.licenseType.value || '');
    sessionStorage.setItem('establishmentName', this.establishmentName.value || '');
    sessionStorage.setItem('mobileNumber', this.mobileNumber.value || '');
    sessionStorage.setItem('licenseNo', this.licenseNo.value || '');
    sessionStorage.setItem('initialGrantDate', this.initialGrantDate.value || '');
    sessionStorage.setItem('renewedFrom', this.renewedFrom.value || '');
    sessionStorage.setItem('validUpTo', this.validUpTo.value || '');
    sessionStorage.setItem('yearlyFee', this.yearlyFee.value || '');
    sessionStorage.setItem('licenseNature', this.licenseNature.value || '');
    sessionStorage.setItem('functioningStatus', this.functioningStatus.value || '');
    sessionStorage.setItem('modeofOperation', this.modeofOperation.value || '');
  }

  updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this[field];
    if (control.hasError('required')) {
      this.errorMessages[field].set('This field is required');
    } else if (control.hasError('pattern')) {
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

  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.keyInfoForm.reset();
    sessionStorage.clear();
  }
}