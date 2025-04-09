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

  @Output() back = new EventEmitter<void>();

  get selectLicenseDetails() {
    return this.getGroupedEntries('selectLicenseDetails');
  }

  get keyInfoDetails() {
    return this.getGroupedEntries('keyInfoDetails');
  }

  get addressDetails() {
    return this.getGroupedEntries('addressDetails');
  }
  
  get unitDetails() {
    return this.getGroupedEntries('unitDetails');
  }

  get memberDetails() {
    return this.getGroupedEntries('memberDetails');
  }

  get licenseType() {
    const storedData = sessionStorage.getItem('keyInfoDetails');
    return storedData ? JSON.parse(storedData).licenseType : null;
  }

  private getGroupedEntries(groupKey: string) {
    const storedData = sessionStorage.getItem(groupKey);
    if (!storedData) return [];

    try {
      const parsedData = JSON.parse(storedData);
      return Object.keys(parsedData).map(key => ({
        key: this.formatKey(key),
        value: parsedData[key]
      }));
    } catch (error) {
      console.error(`Error parsing sessionStorage key "${groupKey}":`, error);
      return [];
    }
  }
  
  private formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  }
  
    
  submit() {
    
  }

  goBack() {
    this.back.emit();
  }
}
