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

  licenseType = new FormControl(this.getFromLocalStorage('licenseType'), [Validators.required]);
  establishmentName = new FormControl(this.getFromLocalStorage('establishmentName'), [
    Validators.required,
    Validators.maxLength(150),
    Validators.pattern(PatternConstants.ORGANISATION_NAME),
  ]);
  mobileNumber = new FormControl(this.getFromLocalStorage('mobileNumber'), [Validators.required, Validators.pattern(PatternConstants.MOBILE)]);
  licenseNo = new FormControl(this.getFromLocalStorage('licenseNo'), [Validators.pattern(PatternConstants.CODE), Validators.maxLength(50)]);
  initialGrantDate = new FormControl(this.getFromLocalStorage('initialGrantDate'));
  renewedFrom = new FormControl(this.getFromLocalStorage('renewedFrom'));
  validUpTo = new FormControl(this.getFromLocalStorage('validUpTo'));
  yearlyFee = new FormControl(this.getFromLocalStorage('yearlyFee'), [Validators.pattern(PatternConstants.NUMBER)]);
  licenseNature = new FormControl(this.getFromLocalStorage('licenseNature'), [Validators.required]);
  functioningStatus = new FormControl(this.getFromLocalStorage('functioningStatus'), [Validators.required]);
  modeofOperation = new FormControl(this.getFromLocalStorage('modeofOperation'), [Validators.required]);

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

  licenseTypes: string[] = ['Type 1', 'Type 2', 'Type 3', 'Type 4'];
  licenseNatures: string[] = ['Nature 1', 'Nature 2', 'Nature 3', 'Nature 4'];
  functioningStatuses: string[] = ['Yes', 'No'];
  modeofOperations: string[] = ['Mode 1', 'Mode 2', 'Mode 3', 'Mode 4'];

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
        this.saveToLocalStorage();
        this.updateAllErrorMessages();
      });
  }

  getFromLocalStorage(key: string): string {
    return localStorage.getItem(key) || '';
  }

  saveToLocalStorage() {
    localStorage.setItem('licenseType', this.licenseType.value || '');
    localStorage.setItem('establishmentName', this.establishmentName.value || '');
    localStorage.setItem('mobileNumber', this.mobileNumber.value || '');
    localStorage.setItem('licenseNo', this.licenseNo.value || '');
    localStorage.setItem('initialGrantDate', this.initialGrantDate.value || '');
    localStorage.setItem('renewedFrom', this.renewedFrom.value || '');
    localStorage.setItem('validUpTo', this.validUpTo.value || '');
    localStorage.setItem('yearlyFee', this.yearlyFee.value || '');
    localStorage.setItem('licenseNature', this.licenseNature.value || '');
    localStorage.setItem('functioningStatus', this.functioningStatus.value || '');
    localStorage.setItem('modeofOperation', this.modeofOperation.value || '');
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
    localStorage.removeItem('licenseType');
    localStorage.removeItem('establishmentName');
    localStorage.removeItem('mobileNumber');
    localStorage.removeItem('licenseNo');
    localStorage.removeItem('initialGrantDate');
    localStorage.removeItem('renewedFrom');
    localStorage.removeItem('validUpTo');
    localStorage.removeItem('yearlyFee');
    localStorage.removeItem('licenseNature');
    localStorage.removeItem('functioningStatus');
    localStorage.removeItem('modeofOperation');
  }
}
