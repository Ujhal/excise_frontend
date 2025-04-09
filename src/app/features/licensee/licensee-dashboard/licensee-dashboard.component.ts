import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-licensee-dashboard',
  standalone: true,
  imports: [ MaterialModule,
    RouterModule
  ],
  templateUrl: './licensee-dashboard.component.html',
  styleUrl: './licensee-dashboard.component.scss'
})
export class LicenseeDashboardComponent {

  constructor(private router: Router) {}

  navigateToApplyLicense() {
    this.router.navigate(['licensee-dashboard/apply-license']);
  }
}
