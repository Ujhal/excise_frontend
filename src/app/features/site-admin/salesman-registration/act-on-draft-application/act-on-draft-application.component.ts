import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-act-on-draft-application',
  imports: [MaterialModule],
  templateUrl: './act-on-draft-application.component.html',
  styleUrl: './act-on-draft-application.component.scss'
})
export class ActOnDraftApplicationComponent {
  displayedColumns: string[] = ['licenseDetails', 'details', 'view'];
  
  get licenseDetails() {
    return this.getEntries([
      'applicationYear', 'applicationId', 'applicationDate',
      'district', 'licenseCategory', 'license', 'modeofOperation'
    ]);
  }

  get modeofOperation() {
    return sessionStorage.getItem('modeofOperation') || 'Default';
  }
  
  get details() {
    return this.getEntries([
      'firstName', 'middleName', 'lastName', 'fatherName',
      'gender', 'dob', 'nationality', 'address',
      'pan', 'aadhaar', 'mobileNumber', 'emailId'
    ]);
  }

  private getEntries(keys: string[]) {
    return keys
      .map(key => ({ key, value: sessionStorage.getItem(key) || '' }))
      .filter(entry => entry.value !== ''); // Remove empty values if needed
  }

  get dataSource() {
    return [{
      licenseDetails: this.licenseDetails,
      details: this.details,
      view: [
        { label: 'View', action: () => this.onView() },
        { label: 'Edit', action: () => this.onEdit() },
        { label: 'Delete', action: () => this.onDelete() },
      ]
    }];
  }

  onView() {
    alert('View clicked');
  }

  onEdit() {
    alert('Edit clicked');
  }

  onDelete() {
    alert('Delete clicked');
  }
}
