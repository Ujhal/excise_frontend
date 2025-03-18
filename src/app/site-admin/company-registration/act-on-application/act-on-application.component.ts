import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-act-on-application',
  imports: [MaterialModule],
  templateUrl: './act-on-application.component.html',
  styleUrl: './act-on-application.component.scss'
})
export class ActOnApplicationComponent {
  displayedColumns: string[] = ['applicationInfo', 'companyDetails', 'view'];
  
  get applicationInfo() {
    return this.getEntries([
      'applicationYear', 'brandType', 'paymentAmount', 'paymentDate'
    ]);
  }

  get companyDetails() {
    return this.getEntries([
      'companyName', 'pan', 'officeAddress', 'factoryAddress',
      'mobileNumber', 'emailId'
    ]);
  }

  private getEntries(keys: string[]) {
    return keys
      .map(key => ({ key, value: sessionStorage.getItem(key) || '' }))
      .filter(entry => entry.value !== ''); // Remove empty values if needed
  }

  get dataSource() {
    return [{
      applicationInfo: this.applicationInfo,
      companyDetails: this.companyDetails,
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
