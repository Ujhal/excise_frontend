import { Component, EventEmitter, Output, ChangeDetectionStrategy, signal } from '@angular/core';
import { MaterialModule } from '../../../../../material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PatternConstants } from '../../../../../config/app.constants';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    MaterialModule,
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressComponent {
  addressForm: FormGroup;

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  siteSubDivision = new FormControl(this.getFromStorage('siteSubDivision'), [Validators.required]);
  policeStation = new FormControl(this.getFromStorage('policeStation'), [Validators.required]);
  locationCategory = new FormControl(this.getFromStorage('locationCategory'), [Validators.required]);
  wardName = new FormControl(this.getFromStorage('wardName'), [Validators.required]);
  businessAddress = new FormControl(this.getFromStorage('businessAddress'), [Validators.required, Validators.maxLength(500)]);
  roadName = new FormControl(this.getFromStorage('roadName'), [Validators.required]);
  pinCode = new FormControl(this.getFromStorage('pinCode'), [Validators.required, Validators.pattern(PatternConstants.PINCODE)]);
  latitude = new FormControl(this.getFromStorage('latitude'));
  longitude = new FormControl(this.getFromStorage('longitude'));

  errorMessages = {
    siteSubDivision: signal(''),
    policeStation: signal(''),
    locationCategory: signal(''),
    wardName: signal(''),
    businessAddress: signal(''),
    roadName: signal(''),
    pinCode: signal(''),
    latitude: signal(''),
    longitude: signal('')
  };

  siteSubDivisions: string[] = ['Subdivision 1', 'Subdivision 2', 'Subdivision 3', 'Subdivision 4'];
  policeStations: string[] = ['Police Station 1', 'Police Station 2', 'Police Station 3', 'Police Station 4'];
  locationCategories: string[] = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  wardNames: string[] = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'];
  roadNames: string[] = ['Road 1', 'Road 2', 'Road 3', 'Road 4'];

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      siteSubDivision: this.siteSubDivision,
      policeStation: this.policeStation,
      locationCategory: this.locationCategory,
      wardName: this.wardName,
      businessAddress: this.businessAddress,
      roadName: this.roadName,
      pinCode: this.pinCode,
      latitude: this.latitude,
      longitude: this.longitude,
    });

    merge(
      this.siteSubDivision.valueChanges,
      this.policeStation.valueChanges,
      this.locationCategory.valueChanges,
      this.wardName.valueChanges,
      this.businessAddress.valueChanges,
      this.roadName.valueChanges,
      this.pinCode.valueChanges,
      this.latitude.valueChanges,
      this.longitude.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.saveToStorage();
        this.updateAllErrorMessages();
      });
  }

  getFromStorage(key: string): string {
    return sessionStorage.getItem(key) || '';
  }

  saveToStorage() {
    sessionStorage.setItem('siteSubDivision', this.siteSubDivision.value || '');
    sessionStorage.setItem('policeStation', this.policeStation.value || '');
    sessionStorage.setItem('locationCategory', this.locationCategory.value || '');
    sessionStorage.setItem('wardName', this.wardName.value || '');
    sessionStorage.setItem('businessAddress', this.businessAddress.value || '');
    sessionStorage.setItem('roadName', this.roadName.value || '');
    sessionStorage.setItem('pinCode', this.pinCode.value || '');
    sessionStorage.setItem('latitude', this.latitude.value || '');
    sessionStorage.setItem('longitude', this.longitude.value || '');
  }

  updateErrorMessage(field: keyof typeof this.errorMessages) {
    const control = this.addressForm.get(field);
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
    if (this.addressForm.valid) {
      this.next.emit();
    }
  }

  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.addressForm.reset();
    sessionStorage.clear();
  }
}