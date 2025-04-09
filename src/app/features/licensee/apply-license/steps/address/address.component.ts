import { Component, EventEmitter, Output, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LicenseeService } from '../../../licensee.services';
import { SubDivision } from '../../../../../core/models/subdivision.model';
import { PoliceStation } from '../../../../../core/models/policestation.model';
import { MaterialModule } from '../../../../../shared/material.module';
import { PatternConstants } from '../../../../../shared/constants/app.constants';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [MaterialModule,],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent implements OnInit, OnDestroy{
  addressForm: FormGroup;
  siteDistrict = '';
  private subDivisions: SubDivision[] = [];
  siteSubDivisions: any[] = [];
  private policeStations: PoliceStation[] = [];
  sitePoliceStations: any[] = [];
  locationCategories: string[] = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  locationNames: string[] = ['Location 1', 'Location 2', 'Location 3', 'Location 4'];
  wardNames: string[] = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'];
  roadNames: string[] = ['Road 1', 'Road 2', 'Road 3', 'Road 4'];
  
  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  
  errorMessages = {
    siteSubDivision: signal(''),
    policeStation: signal(''),
    locationCategory: signal(''),
    locationName: signal(''),
    wardName: signal(''),
    businessAddress: signal(''),
    roadName: signal(''),
    pinCode: signal(''),
    latitude: signal(''),
    longitude: signal('')
  };

  constructor(private fb: FormBuilder, private licenseeService: LicenseeService) {
    const storedValues = this.getFromSessionStorage();

    this.addressForm = this.fb.group({
      siteSubDivision: new FormControl(storedValues.siteSubDivision, [Validators.required]),
      policeStation:new FormControl(storedValues.policeStation, [Validators.required]),
      locationCategory: new FormControl(storedValues.locationCategory, [Validators.required]),
      locationName: new FormControl(storedValues.locationName, [Validators.required]),
      wardName: new FormControl(storedValues.wardName, [Validators.required]),
      businessAddress: new FormControl(storedValues.businessAddress, [Validators.required, Validators.maxLength(500)]),
      roadName: new FormControl(storedValues.roadName, [Validators.required]),
      pinCode: new FormControl(storedValues.pinCode, [Validators.required, Validators.pattern(PatternConstants.PINCODE)]),
      latitude: new FormControl(storedValues.latitude),
      longitude: new FormControl(storedValues.longitude),
    })

    this.addressForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
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
/*
  get exciseDistrict() {
    return sessionStorage.getItem('exciseDistrict') || '';
  }
*/
  private loadDropdownData(): void {    
    this.licenseeService.getSubDivision().subscribe((data: SubDivision[]) => {
      this.siteSubDivisions = data;
      }, error => {
        console.error('Failed to load subdivisions.', error);
    });

    this.licenseeService.getPoliceStations().subscribe((data: PoliceStation[]) => {
      this.policeStations = data;
      }, error => {
        console.error('Failed to load subdivisions.', error);``
    });
  }

  onSubDivisionChange(name: string): void {
    this.sitePoliceStations = this.policeStations.filter(ps => ps.SubDivisionName === name);
    console.log('Filtered police station:', this.sitePoliceStations);
  }

  private getFromSessionStorage(): any {
    const storedData = sessionStorage.getItem('addressDetails');
    return storedData ? JSON.parse(storedData) : {};
  }

  private saveToSessionStorage() {
    const formData = this.addressForm.getRawValue(); 
    sessionStorage.setItem('addressDetails', JSON.stringify(formData));
  }

  private updateErrorMessage(field: keyof typeof this.errorMessages) {
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

  resetForm() {
    this.addressForm.reset();
    sessionStorage.removeItem('addressDetails');
  }

  goBack() {
    this.back.emit();
  }
}