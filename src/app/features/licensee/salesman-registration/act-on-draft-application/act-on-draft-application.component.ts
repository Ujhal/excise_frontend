import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-act-on-draft-application',
  imports: [MaterialModule],
  templateUrl: './act-on-draft-application.component.html',
  styleUrl: './act-on-draft-application.component.scss'
})
export class ActOnDraftApplicationComponent {
  // Columns displayed in the draft application table
  displayedColumns: string[] = ['licenseDetails', 'details', 'view'];

  // Retrieves license details from session storage
  get licenseDetails() {
    return this.getEntries([
      'applicationYear', 'applicationId', 'applicationDate',
      'district', 'licenseCategory', 'license', 'modeofOperation'
    ]);
  }

  // Retrieves the mode of operation from session storage or defaults to 'Default'
  get modeofOperation() {
    return sessionStorage.getItem('modeofOperation') || 'Default';
  }
  
  // Retrieves applicant details from session storage
  get details() {
    return this.getEntries([
      'firstName', 'middleName', 'lastName', 'fatherName',
      'gender', 'dob', 'nationality', 'address',
      'pan', 'aadhaar', 'mobileNumber', 'emailId'
    ]);
  }

  // Helper method to retrieve values from session storage based on provided keys
  private getEntries(keys: string[]) {
    return keys
      .map(key => ({ key, value: sessionStorage.getItem(key) || '' })) // Create an array of key-value pairs
      .filter(entry => entry.value !== ''); // Remove any entries with empty values
  }

  // Data source for the table, combining license details, application details, and actions
  get dataSource() {
    return [{
      licenseDetails: this.licenseDetails,
      details: this.details,
      view: [
        // Array of actions with labels and corresponding action methods
        { label: 'View', action: () => this.onView() },
        { label: 'Edit', action: () => this.onEdit() },
        { label: 'Delete', action: () => this.onDelete() },
      ]
    }];
  }

  // Method called when the "View" action is clicked
  onView() {
    alert('View clicked');  // Display an alert message for demonstration purposes
  }

  // Method called when the "Edit" action is clicked
  onEdit() {
    alert('Edit clicked');  // Display an alert message for demonstration purposes
  }

  // Method called when the "Delete" action is clicked
  onDelete() {
    alert('Delete clicked');  // Display an alert message for demonstration purposes
  }
}
