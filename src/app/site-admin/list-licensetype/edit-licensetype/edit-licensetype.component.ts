import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SiteAdminService } from '../../site-admin-service';
import { LicenseType } from '../../../shared/models/license-type.model';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-edit-licensetype',
  imports: [MaterialModule],
  templateUrl: './edit-licensetype.component.html',
  styleUrl: './edit-licensetype.component.scss'
})
export class EditLicensetypeComponent {
  constructor(
    public dialogRef: MatDialogRef<EditLicensetypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LicenseType,
    private siteAdminService: SiteAdminService
  ) {}

  onSave(): void {
    const updatedData: Partial<LicenseType> = {
      id: this.data.id,
      licenseType: this.data.licenseType,
    };
  
    this.siteAdminService.updateLicenseType(this.data.id, updatedData).subscribe(
      () => {
        Swal.fire('Updated!', 'License Type updated successfully.', 'success');
        this.dialogRef.close(true);
      },
      error => {
        Swal.fire('Error!', 'Failed to update the license type.', 'error');
        console.error('Error updating license type:', error);
      }
    );
  }  

  onCancel(): void {
    this.dialogRef.close();
  }
}
