import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../shared/material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-license',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './license.component.html',
  styleUrl: './license.component.scss'
})
export class LicenseComponent {

  // Event emitter to go back to the previous step
  @Output() back = new EventEmitter<void>();

  // Getter for LICENSE DETAILS data from sessionStorage
  get selectLicenseDetails() {
    return this.getGroupedEntries('selectLicenseDetails');
  }

  // Getter for KEY INFO data from sessionStorage
  get keyInfoDetails() {
    return this.getGroupedEntries('keyInfoDetails');
  }

  // Getter for ADDRESS data from sessionStorage
  get addressDetails() {
    return this.getGroupedEntries('addressDetails');
  }

  // Getter for UNIT DETAILS data from sessionStorage
  get unitDetails() {
    return this.getGroupedEntries('unitDetails');
  }

  // Getter for MEMBER DETAILS data from sessionStorage
  get memberDetails() {
    return this.getGroupedEntries('memberDetails');
  }

  // Retrieves the licenseType (e.g., "Company") to conditionally display unit details
  get licenseType() {
    const storedData = sessionStorage.getItem('keyInfoDetails');
    return storedData ? JSON.parse(storedData).licenseType : null;
  }

  // Utility function to fetch and format entries from sessionStorage
  private getGroupedEntries(groupKey: string) {
    const storedData = sessionStorage.getItem(groupKey);
    if (!storedData) return [];

    try {
      const parsedData = JSON.parse(storedData);
      // Converts each key-value pair into a readable format
      return Object.keys(parsedData).map(key => ({
        key: this.formatKey(key),
        value: parsedData[key]
      }));
    } catch (error) {
      console.error(`Error parsing sessionStorage key "${groupKey}":`, error);
      return [];
    }
  }

  // Converts camelCase keys into human-readable format (e.g., "memberName" → "Member Name")
  private formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  }

  // Function to handle final submission (to be implemented)
  submit() {
    // Submission logic goes here
  }

  // Emits the back event to navigate to the previous screen
  goBack() {
    this.back.emit();
  }
}
