// Core Angular imports
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material Dialog service for opening modals
import { MatDialog } from '@angular/material/dialog';

// Component that will be used in the dialog popup
import { UserProfileComponent } from './user-profile/user-profile.component';

// Custom material module (reusable material components)
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-licensee-home', // Component selector used in HTML
  imports: [ CommonModule, RouterModule, RouterOutlet, MaterialModule ], // Modules needed for this component
  templateUrl: './licensee-home.component.html', // Path to the component’s HTML template
  styleUrl: './licensee-home.component.scss' // Path to the component’s SCSS styles
})
export class LicenseeHomeComponent {
  loaded = true; // Flag to indicate if the component is loaded
  userName = 'FirstName LN'; // Placeholder user name to display in the sidebar

  constructor(private dialog: MatDialog) {} // Injecting MatDialog service for opening modals

  // Method to toggle the sidebar (sidenav)
  snavToggle(sidenav: any) {
    sidenav.toggle(); // Toggle open/close of the sidenav
  }

  // Method to handle the "View Profile" button click
  viewProfile(): void {
    console.log('Button Clicked!');

    // Open the UserProfileComponent as a dialog
    const dialogRef = this.dialog.open(UserProfileComponent, {
      width: '500px', // Set dialog width
    });

    // Optional: Log when the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }
}
