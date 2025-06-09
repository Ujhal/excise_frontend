// Importing necessary modules
import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-act-on-application', // Selector used in the HTML to render this component
  imports: [MaterialModule], // Importing Angular Material module for UI components
  templateUrl: './act-on-application.component.html', // HTML template for the component
  styleUrl: './act-on-application.component.scss' // SCSS file for styling
})
export class ActOnApplicationComponent {

  // Columns to be displayed in the table
  displayedColumns: string[] = ['applicationInfo', 'companyDetails', 'view'];

  /**
   * Getter to retrieve Application Info from session storage.
   * Keys are defined for application-related fields.
   */
  get applicationInfo() {
    return this.getEntries([
      'applicationYear', 
      'brandType', 
      'paymentAmount', 
      'paymentDate'
    ]);
  }

  /**
   * Getter to retrieve Company Details from session storage.
   * Keys are defined for company-related fields.
   */
  get companyDetails() {
    return this.getEntries([
      'companyName', 
      'pan', 
      'officeAddress', 
      'factoryAddress',
      'mobileNumber', 
      'emailId'
    ]);
  }

  /**
   * Helper method to get key-value pairs from session storage.
   * Filters out entries that have empty values.
   * 
   * @param keys - array of session storage keys to retrieve
   * @returns an array of objects with key and corresponding value
   */
  private getEntries(keys: string[]) {
    return keys
      .map(key => ({ key, value: sessionStorage.getItem(key) || '' }))
      .filter(entry => entry.value !== ''); // Exclude entries with empty values
  }

  /**
   * Getter to construct the table data source dynamically.
   * Combines application info, company details, and action buttons.
   */
  get dataSource() {
    return [{
      applicationInfo: this.applicationInfo, // Application data section
      companyDetails: this.companyDetails,   // Company data section
      view: [                                // Array of action buttons with labels and methods
        { label: 'View', action: () => this.onView() },
        { label: 'Edit', action: () => this.onEdit() },
        { label: 'Delete', action: () => this.onDelete() },
      ]
    }];
  }

  // Action method triggered by clicking the "View" button
  onView() {
    alert('View clicked');
  }

  // Action method triggered by clicking the "Edit" button
  onEdit() {
    alert('Edit clicked');
  }

  // Action method triggered by clicking the "Delete" button
  onDelete() {
    alert('Delete clicked');
  }
}
