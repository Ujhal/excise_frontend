import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { KeyInfoComponent } from './steps/key-info/key-info.component';
import { AddressComponent } from './steps/address/address.component';
import { UnitDetailsComponent } from './steps/unit-details/unit-details.component';
import { MemberDetailsComponent } from './steps/member-details/member-details.component';
import { LicenseComponent } from './steps/license/license.component';
import { SelectLicenseComponent } from './steps/select-license/select-license.component';

@Component({
  selector: 'app-apply-license',
  standalone: true,
  imports: [
    MaterialModule,
    SelectLicenseComponent,
    KeyInfoComponent,
    AddressComponent,
    UnitDetailsComponent,
    MemberDetailsComponent,
    LicenseComponent
  ],
  templateUrl: './apply-license.component.html',
  styleUrl: './apply-license.component.scss'
})
export class ApplyLicenseComponent {
  get licenseType() {
    const storedData = sessionStorage.getItem('keyInfoDetails');
    return storedData ? JSON.parse(storedData).licenseType : null;
  }
}
