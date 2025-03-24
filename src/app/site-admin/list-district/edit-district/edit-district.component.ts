import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SiteAdminService } from '../../site-admin-service';
import { District } from '../../../shared/models/district.model';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-edit-district',
  imports: [MaterialModule],
  templateUrl: './edit-district.component.html',
  styleUrl: './edit-district.component.scss'
})
export class EditDistrictComponent {
  constructor(
    public dialogRef: MatDialogRef<EditDistrictComponent>,
    @Inject(MAT_DIALOG_DATA) public data: District,
    private siteAdminService: SiteAdminService
  ) {}

  onSave(): void {
    const updatedData: Partial<District> = {
      District: this.data.District,
      DistrictNameLL: this.data.DistrictNameLL,
      DistrictCode: this.data.DistrictCode,
    };
  
    this.siteAdminService.updateDistrict(this.data.id, updatedData).subscribe(
      () => {
        Swal.fire('Updated!', 'District updated successfully.', 'success');
        this.dialogRef.close(true);
      },
      error => {
        Swal.fire('Error!', 'Failed to update the district.', 'error');
        console.error('Error updating district:', error);
      }
    );
  }  

  onCancel(): void {
    this.dialogRef.close();
  }
}
