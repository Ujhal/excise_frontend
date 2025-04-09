import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';
import { LicenseComponent } from './steps/license/license.component';
import { DetailsComponent } from "./steps/details/details.component";
import { MakePaymentComponent } from "./steps/make-payment/make-payment.component";
import { SubmitApplicationComponent } from "./steps/submit-application/submit-application.component";

@Component({
  selector: 'app-salesman-registration',
  imports: [MaterialModule, LicenseComponent, DetailsComponent, MakePaymentComponent, SubmitApplicationComponent],
  templateUrl: './prepare-application.component.html',
  styleUrl: './prepare-application.component.scss'
})
export class PrepareApplicationComponent {
  get role() {
    const storedData = sessionStorage.getItem('licenseDetails');
    return storedData ? JSON.parse(storedData).role : null;
  }
}
