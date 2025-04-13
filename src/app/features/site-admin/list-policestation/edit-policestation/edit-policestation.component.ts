import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // For dialog functionality
import { SiteAdminService } from '../../site-admin-service'; // Service for API calls
import { SubDivision } from '../../../../core/models/subdivision.model'; // Model for SubDivision
import { PoliceStation } from '../../../../core/models/policestation.model'; // Model for PoliceStation
import Swal from 'sweetalert2'; // For showing alerts
import { MaterialModule } from '../../../../shared/material.module'; // For importing Material Design components

@Component({
  selector: 'app-edit-policestation',
  imports: [MaterialModule], // Importing Material module
  templateUrl: './edit-policestation.component.html', // HTML template for the component
  styleUrl: './edit-policestation.component.scss' // Styling for the component
})
export class EditPolicestationComponent {
  subDivisions: SubDivision[] = []; // Array to hold SubDivision data

  constructor(
    public dialogRef: MatDialogRef<EditPolicestationComponent>, // Dialog reference to control the dialog
    @Inject(MAT_DIALOG_DATA) public data: PoliceStation, // Injecting the PoliceStation data into the component
    private siteAdminService: SiteAdminService // Injecting the service to fetch data
  ) {}

  ngOnInit(): void {
    // On component initialization, load the list of SubDivisions
    this.loadSubdivisions();
  }

  // Method to load SubDivisions from the backend
  loadSubdivisions(): void {
    this.siteAdminService.getSubDivision().subscribe(
      (subDivisions) => {
        this.subDivisions = subDivisions; // Assign fetched subdivisions to the subDivisions array
      },
      (error) => {
        console.error('Error fetching subdivisions:', error); // Log error in case of failure
      }
    );
  }

  // Method to handle the change in selected subdivision from the dropdown
  onSubDivisionChange(selectedSubdivision: SubDivision): void {
    if (selectedSubdivision) {
      // Set the SubDivisionName and SubDivisionCode in the data object when a selection is made
      this.data.SubDivisionName = selectedSubdivision.SubDivisionName;
      this.data.SubDivisionCode = selectedSubdivision.SubDivisionCode;
    }
  }

  // Method to save the updated police station data
  onSave(): void {
    const updatedData = {
      PoliceStationName: this.data.PoliceStationName,
      PoliceStationCode: this.data.PoliceStationCode,
      SubDivisionName: this.data.SubDivisionName,
      SubDivisionCode: this.data.SubDivisionCode,
    };

    // Call the service to update the police station data
    this.siteAdminService.updatePolicestation(this.data.id, updatedData).subscribe(
      () => {
        // Show success alert and close the dialog
        Swal.fire('Updated!', 'Police Station updated successfully.', 'success');
        this.dialogRef.close(true);
      },
      error => {
        // Show error alert in case of failure
        Swal.fire('Error!', 'Failed to update the police station.', 'error');
        console.error('Error updating police station:', error); // Log error in case of failure
      }
    );
  }

  // Method to cancel and close the dialog without saving any changes
  onCancel(): void {
    this.dialogRef.close();
  }
}
