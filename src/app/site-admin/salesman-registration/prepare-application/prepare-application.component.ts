import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { LicenseComponent } from './license/license.component';
import { DetailsComponent } from "./details/details.component";
import { MakePaymentComponent } from "./make-payment/make-payment.component";
import { SubmitApplicationComponent } from "./submit-application/submit-application.component";

@Component({
  selector: 'app-salesman-registration',
  imports: [MaterialModule, LicenseComponent, DetailsComponent, MakePaymentComponent, SubmitApplicationComponent],
  templateUrl: './prepare-application.component.html',
  styleUrl: './prepare-application.component.scss'
})
export class PrepareApplicationComponent {
  get modeofOperation() {
    return sessionStorage.getItem('modeofOperation');
  }
}
