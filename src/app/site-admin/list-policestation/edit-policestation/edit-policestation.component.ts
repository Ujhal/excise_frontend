import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SiteAdminService } from '../../site-admin-service';
import { SubDivision } from '../../../shared/models/subdivision.model';
import { PoliceStation } from '../../../shared/models/policestation.model';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-edit-policestation',
  imports: [MaterialModule],
  templateUrl: './edit-policestation.component.html',
  styleUrl: './edit-policestation.component.scss'
})
export class EditPolicestationComponent {
  subDivisions: SubDivision[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditPolicestationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PoliceStation,
    private siteAdminService: SiteAdminService
  ) {}

  ngOnInit(): void {
    this.loadSubdivisions();
  }

  loadSubdivisions(): void {
    this.siteAdminService.getSubDivision().subscribe(
      (subDivisions) => {
        this.subDivisions = subDivisions;
      },
      (error) => {
        console.error('Error fetching subdivisions:', error);
      }
    );
  }

  onSubDivisionChange(selectedSubdivision: SubDivision): void {
    if (selectedSubdivision) {
      this.data.SubDivisionName = selectedSubdivision.SubDivisionName;
      this.data.SubDivisionCode = selectedSubdivision.SubDivisionCode;
    }
  }  

  onSave(): void {
    const updatedData = {
      PoliceStationName: this.data.PoliceStationName,
      PoliceStationCode: this.data.PoliceStationCode,
      SubDivisionName: this.data.SubDivisionName,
      SubDivisionCode: this.data.SubDivisionCode,
    };

    this.siteAdminService.updatePolicestation(this.data.id, updatedData).subscribe(
      () => {
        Swal.fire('Updated!', 'Police Station updated successfully.', 'success');
        this.dialogRef.close(true);
      },
      error => {
        Swal.fire('Error!', 'Failed to update the police station.', 'error');
        console.error('Error updating police station:', error);
      }
    );
  }  

  onCancel(): void {
    this.dialogRef.close();
  }
}
