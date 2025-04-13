import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile', // Component selector used if included in templates
  imports: [MaterialModule], // Import shared Material module for Angular Material components
  templateUrl: './user-profile.component.html', // External HTML template for the component
  styleUrl: './user-profile.component.scss' // External SCSS stylesheet for the component
})
export class UserProfileComponent {
  // Flag to indicate if the data/component has fully loaded
  loaded = true;

  // Sample user data object to display in the UI (static for now)
  user = {
    firstName: 'FirstName',
    lastName: 'LastName',
    username: 'firstnamelastname',
    email: 'firstnamelastname@example.com',
    phoneNumber: '123-456-7890',
    role: 'User',
    district: 'Gangtok',
    subDivision: 'Ranka',
    address: 'Down from the Left',
    createdBy: 'Admin'
  };

  // Injecting reference to the dialog instance so we can close it programmatically
  constructor(public dialogRef: MatDialogRef<UserProfileComponent>) {}

  // Method to close the dialog when the "Close" button is clicked
  closeDialog(): void {
    this.dialogRef.close();
  }
}
