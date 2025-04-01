import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { KeyInfoComponent } from './stepper/key-info/key-info.component';
import { AddressComponent } from './stepper/address/address.component';
import { UnitDetailsComponent } from './stepper/unit-details/unit-details.component';
import { MemberDetailsComponent } from './stepper/member-details/member-details.component';
import { LicenseComponent } from './stepper/license/license.component';
import { SelectLicenseComponent } from './stepper/select-license/select-license.component';

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
