import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-submit-application',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './submit-application.component.html',
  styleUrl: './submit-application.component.scss'
})
export class SubmitApplicationComponent {

  @Output() back = new EventEmitter<void>();

  get licenseDetails() {
    return this.getGroupedEntries('licenseDetails');
  }

  get personDetails() {
    return this.getGroupedEntries('personDetails');
  }

  get uploadedDocuments() {
    const storedDocs = sessionStorage.getItem('uploadedDocuments');
    if (!storedDocs) return [];
  
    try {
      const parsedDocs = JSON.parse(storedDocs);
      
      // Convert the object into an array of { key: "Document Type", ...fileObject }
      return Object.entries(parsedDocs).map(([key, fileObj]: [string, any]) => ({
        key,  // The document type (e.g., "Passport Size Photo")
        name: fileObj.name,
        type: fileObj.type,
        size: fileObj.size,
        fileUrl: fileObj.fileUrl || ''  // Ensure fileUrl exists if saved
      }));
    } catch (error) {
      console.error("Error parsing uploadedDocuments:", error);
      return [];
    }
  }

  get modeofOperation() {
    const storedData = sessionStorage.getItem('licenseDetails');
    return storedData ? JSON.parse(storedData).modeofOperation : null;
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
