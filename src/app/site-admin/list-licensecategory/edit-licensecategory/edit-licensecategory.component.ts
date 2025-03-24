import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SiteAdminService } from '../../site-admin-service';
import { LicenseCategory } from '../../../shared/models/license-category.model';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-edit-licensecategory',
  imports: [MaterialModule],
  templateUrl: './edit-licensecategory.component.html',
  styleUrl: './edit-licensecategory.component.scss'
})
export class EditLicensecategoryComponent {
  constructor(
    public dialogRef: MatDialogRef<EditLicensecategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LicenseCategory,
    private siteAdminService: SiteAdminService
  ) {}

  onSave(): void {
    const updatedData: Partial<LicenseCategory> = {
      licenseCategoryDescription: this.data.licenseCategoryDescription,
    };
  
    this.siteAdminService.updateLicenseCategory(this.data.id, updatedData).subscribe(
      () => {
        Swal.fire('Updated!', 'License Category updated successfully.', 'success');
        this.dialogRef.close(true);
      },
      error => {
        Swal.fire('Error!', 'Failed to update the license category.', 'error');
        console.error('Error updating license category:', error);
      }
    );
  }  

  onCancel(): void {
    this.dialogRef.close();
  }
}
