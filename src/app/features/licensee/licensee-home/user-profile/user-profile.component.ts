import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../../../../core/services/account.service';

@Component({
  selector: 'app-user-profile', // Component selector used if included in templates
  imports: [MaterialModule], // Import shared Material module for Angular Material components
  templateUrl: './user-profile.component.html', // External HTML template for the component
  styleUrl: './user-profile.component.scss' // External SCSS stylesheet for the component
})
export class UserProfileComponent {
  user: any;        // Stores the currently authenticated user's data
  loaded = true;    // Flag to indicate if the data/component has fully loaded

  // Injecting reference to the dialog instance so we can close it programmatically
  constructor(
    public dialogRef: MatDialogRef<UserProfileComponent>,
    private accountService: AccountService
  ) {}

  // Angular lifecycle hook, runs after component initializes
  ngOnInit(): void {
    // Subscribing to the authentication state to get user info
    this.accountService.getAuthenticationState().subscribe(acc => {
      if (acc !== null) {
        this.user = acc; // Assign user data if account is authenticated
      }
      this.loaded = true; // Mark the loading complete whether user is null or not
    });
  }

  // Method to close the dialog when the "Close" button is clicked
  closeDialog(): void {
    this.dialogRef.close();
  }
}
