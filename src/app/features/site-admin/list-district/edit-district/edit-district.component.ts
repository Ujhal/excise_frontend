// Import required Angular core and Material components
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Import service and model
import { SiteAdminService } from '../../site-admin-service';
import { District } from '../../../../core/models/district.model';

// Import SweetAlert for user notifications
import Swal from 'sweetalert2';

// Import material module for UI components
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-edit-district', // Component selector
  imports: [MaterialModule],     // Standalone imports
  templateUrl: './edit-district.component.html', // Template file
  styleUrl: './edit-district.component.scss'     // Styling file
})
export class EditDistrictComponent {

  // Inject dialog reference to control the dialog and pass data into it
  constructor(
    public dialogRef: MatDialogRef<EditDistrictComponent>, // Used to close the dialog and return data
    @Inject(MAT_DIALOG_DATA) public data: District,        // Injected data from the parent component
    private siteAdminService: SiteAdminService             // Service to perform API calls
  ) {}

  // Method to save updated district details
  onSave(): void {
    // Prepare updated object with only required fields
    const updatedData: Partial<District> = {
      District: this.data.District,
      DistrictNameLL: this.data.DistrictNameLL,
      DistrictCode: this.data.DistrictCode,
    };

    // Call the update API and handle success or error
    this.siteAdminService.updateDistrict(this.data.id, updatedData).subscribe(
      () => {
        Swal.fire('Updated!', 'District updated successfully.', 'success'); // Success alert
        this.dialogRef.close(true); // Close the dialog and pass success flag
      },
      error => {
        Swal.fire('Error!', 'Failed to update the district.', 'error'); // Error alert
        console.error('Error updating district:', error); // Log error
      }
    );
  }

  // Method to cancel editing and close the dialog without saving
  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without passing data
  }
}
