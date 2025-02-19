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

  siteSubDivision = new FormControl(this.getFromLocalStorage('siteSubDivision'), [Validators.required]);
  policeStation = new FormControl(this.getFromLocalStorage('policeStation'), [Validators.required]);
  locationCategory = new FormControl(this.getFromLocalStorage('locationCategory'), [Validators.required]);
  wardName = new FormControl(this.getFromLocalStorage('wardName'), [Validators.required]);
  businessAddress = new FormControl(this.getFromLocalStorage('businessAddress'), [Validators.required, Validators.maxLength(500)]);
  roadName = new FormControl(this.getFromLocalStorage('roadName'), [Validators.required]);
  pinCode = new FormControl(this.getFromLocalStorage('pinCode'), [Validators.required, Validators.pattern(PatternConstants.PINCODE)]);
  latitude = new FormControl(this.getFromLocalStorage('latitude'));
  longitude = new FormControl(this.getFromLocalStorage('longitude'));

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
        this.saveToLocalStorage();
        this.updateAllErrorMessages();
      });
  }

  getFromLocalStorage(key: string): string {
    return localStorage.getItem(key) || '';
  }

  saveToLocalStorage() {
    localStorage.setItem('siteSubDivision', this.siteSubDivision.value || '');
    localStorage.setItem('policeStation', this.policeStation.value || '');
    localStorage.setItem('locationCategory', this.locationCategory.value || '');
    localStorage.setItem('wardName', this.wardName.value || '');
    localStorage.setItem('businessAddress', this.businessAddress.value || '');
    localStorage.setItem('roadName', this.roadName.value || '');
    localStorage.setItem('pinCode', this.pinCode.value || '');
    localStorage.setItem('latitude', this.latitude.value || '');
    localStorage.setItem('longitude', this.longitude.value || '');
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
    if (this.addressForm.valid) {
      this.next.emit();
    }
  }

  goBack() {
    this.back.emit();
  }

  resetForm() {
    this.addressForm.reset();
    localStorage.removeItem('siteSubDivision');
    localStorage.removeItem('policeStation');
    localStorage.removeItem('locationCategory');
    localStorage.removeItem('wardName');
    localStorage.removeItem('businessAddress');
    localStorage.removeItem('roadName');
    localStorage.removeItem('pinCode');
    localStorage.removeItem('latitude');
    localStorage.removeItem('longitude');
  }
}
