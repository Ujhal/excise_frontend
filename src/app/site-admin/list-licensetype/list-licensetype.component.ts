import { Component, OnInit  } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { LicenseType } from '../../shared/models/license-type.model';
import { SiteAdminService } from '../site-admin-service';

@Component({
  selector: 'app-list-licensetype',
  imports: [MaterialModule, RouterModule],
  templateUrl: './list-licensetype.component.html',
  styleUrl: './list-licensetype.component.scss'
})
export class ListLicensetypeComponent implements OnInit{
  displayedColumns: string[] = ['slNo', 'licenseType', 'actions'];
  licenseTypeDataSource = new MatTableDataSource<LicenseType>();

  constructor(private siteAdminService: SiteAdminService) {}

  ngOnInit(): void {
    this.loadLicenseTypes();
  }

  loadLicenseTypes(): void {
    this.siteAdminService.getLicenseTypes().subscribe(data => {
      this.licenseTypeDataSource.data = data;
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
