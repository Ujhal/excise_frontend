import { Component, OnInit  } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../base/base.components';
import { BaseDependency } from '../../../base/dependency/base.dependendency';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { LicenseType } from '../../../core/models/license-type.model';
import { SiteAdminService } from '../site-admin-service';
import { EditLicensetypeComponent } from './edit-licensetype/edit-licensetype.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-licensetype',
  imports: [MaterialModule, RouterModule],
  templateUrl: './list-licensetype.component.html',
  styleUrl: './list-licensetype.component.scss'
})
export class ListLicensetypeComponent extends BaseComponent implements OnInit{
  displayedColumns: string[] = ['id', 'licenseType', 'actions'];
  licenseTypeDataSource = new MatTableDataSource<LicenseType>();

  constructor(base: BaseDependency, private siteAdminService: SiteAdminService, private dialog: MatDialog) { 
    super(base); 
  }

  ngOnInit(): void {
    this.loadLicenseTypes();
  }

  loadLicenseTypes(): void {
    this.siteAdminService.getLicenseTypes().subscribe(data => {
      this.licenseTypeDataSource.data = data;
    });
  }

  onEdit(district: LicenseType): void {
    const dialogRef = this.dialog.open(EditLicensetypeComponent, {
      width: '400px',
      data: { ...district }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLicenseTypes(); // Reload districts after update
      }
    });
  }

  onDelete(element: LicenseType): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the license type.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.siteAdminService.deleteLicenseType(element.id).subscribe(
          () => {
            Swal.fire('Deleted!', 'The license type has been deleted.', 'success');
            this.loadLicenseTypes(); // Refresh the table after deletion
            this.router.navigate([`./site-admin/list-licensetype`]);
          },
          (error) => {
            console.error('Error deleting license type:', error);
            Swal.fire('Error!', 'There was a problem deleting the license type.', 'error');
          }
        );
      }
    });
  }
}
