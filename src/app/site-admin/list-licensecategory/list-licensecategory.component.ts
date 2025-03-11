import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { LicenseCategory } from '../../shared/models/license-category.model';
import { SiteAdminService } from '../site-admin-service';

@Component({
  selector: 'app-list-licensecategory',
  imports: [MaterialModule, RouterModule],
  templateUrl: './list-licensecategory.component.html',
  styleUrl: './list-licensecategory.component.scss'
})
export class ListLicensecategoryComponent implements OnInit {
  displayedColumns: string[] = ['slNo', 'licenseCategory', 'actions'];
  licenseCategoryDataSource = new MatTableDataSource<LicenseCategory>();

  constructor(private siteAdminService: SiteAdminService) {}

  ngOnInit(): void {
    this.loadLicenseCategories();
  }

  loadLicenseCategories(): void {
    this.siteAdminService.getLicenseCategories().subscribe(data => {
      this.licenseCategoryDataSource.data = data;
    });
  }
  
  onDelete(element: LicenseCategory): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the license type.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.siteAdminService.deleteLicenseCategory(element.id).subscribe(
          () => {
            Swal.fire('Deleted!', 'The license category has been deleted.', 'success');
            this.loadLicenseCategories(); // Refresh the table after deletion
          },
          (error) => {
            console.error('Error deleting license category:', error);
            Swal.fire('Error!', 'There was a problem deleting the license category.', 'error');
          }
        );
      }
    });
  }
}
