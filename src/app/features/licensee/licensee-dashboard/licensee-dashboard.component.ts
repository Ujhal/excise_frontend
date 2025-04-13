import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module'; // Shared Angular Material components
import { Router, RouterModule } from '@angular/router'; // Router for navigation

@Component({
  selector: 'app-licensee-dashboard', // Selector for the component
  standalone: true, // Indicates this is a standalone component (doesn't require an NgModule)
  imports: [ 
    MaterialModule, // Importing shared material components
    RouterModule    // Enables use of routing/navigation features
  ],
  templateUrl: './licensee-dashboard.component.html', // Template file for the component
  styleUrl: './licensee-dashboard.component.scss'     // SCSS file for styling the component
})
export class LicenseeDashboardComponent {

  // Injecting Angular's Router to programmatically navigate between routes
  constructor(private router: Router) {}

  // Method to navigate to the "apply-license" page under this component
  navigateToApplyLicense() {
    this.router.navigate(['licensee-dashboard/apply-license']);
    // Note: This path assumes that 'licensee-dashboard' is a valid route segment
  }
}
