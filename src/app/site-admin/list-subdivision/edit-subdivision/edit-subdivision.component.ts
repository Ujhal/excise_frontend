import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SiteAdminService } from '../../site-admin-service';
import { District } from '../../../shared/models/district.model';
import { SubDivision } from '../../../shared/models/subdivision.model';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-edit-subdivision',
  imports: [MaterialModule],
  templateUrl: './edit-subdivision.component.html',
  styleUrl: './edit-subdivision.component.scss'
})
export class EditSubdivisionComponent {
  districts: District[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditSubdivisionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubDivision,
    private siteAdminService: SiteAdminService
  ) {}

  ngOnInit(): void {
    this.loadDistricts();
  }

  loadDistricts(): void {
    this.siteAdminService.getDistrict().subscribe(
      (districts) => {
        this.districts = districts;
      },
      (error) => {
        console.error('Error fetching districts:', error);
      }
    );
  }

  onDistrictChange(selectedDistrict: District): void {
    if (selectedDistrict) {
      this.data.District = selectedDistrict.District;
      this.data.DistrictCode = selectedDistrict.DistrictCode;
    }
  }  

  onSave(): void {
    const updatedData = { 
      SubDivisionName: this.data.SubDivisionName,
      SubDivisionNameLL: this.data.SubDivisionNameLL,
      SubDivisionCode: this.data.SubDivisionCode,
      District: this.data.District,
      DistrictCode: this.data.DistrictCode
    };

    this.siteAdminService.updateSubDivision(this.data.id, updatedData).subscribe(
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
