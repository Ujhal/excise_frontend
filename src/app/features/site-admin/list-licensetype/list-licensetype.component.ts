import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';  // Import Material design components
import { RouterModule } from '@angular/router';  // Router module for navigation
import { BaseComponent } from '../../../base/base.components';  // BaseComponent to extend functionality
import { BaseDependency } from '../../../base/dependency/base.dependendency';  // BaseDependency for dependency injection
import Swal from 'sweetalert2';  // Import SweetAlert for popups
import { MatTableDataSource } from '@angular/material/table';  // Import Material Table DataSource
import { LicenseType } from '../../../core/models/license-type.model';  // Import LicenseType model
import { SiteAdminService } from '../site-admin-service';  // Import service to fetch data from the backend
import { EditLicensetypeComponent } from './edit-licensetype/edit-licensetype.component';  // Component for editing license type
import { MatDialog } from '@angular/material/dialog';  // Import Material Dialog module

@Component({
  selector: 'app-list-licensetype',  // Component selector
  imports: [MaterialModule, RouterModule],  // Import Material and Router modules for this component
  templateUrl: './list-licensetype.component.html',  // Path to the HTML template for the component
  styleUrl: './list-licensetype.component.scss'  // Path to the SCSS styles for the component
})
export class ListLicensetypeComponent extends BaseComponent implements OnInit {
  // Define the columns for the Material table
  displayedColumns: string[] = ['id', 'licenseType', 'actions'];
  
  // Initialize the data source for the table (MatTableDataSource is used to bind data to the Material table)
  licenseTypeDataSource = new MatTableDataSource<LicenseType>();

  constructor(base: BaseDependency, private siteAdminService: SiteAdminService, private dialog: MatDialog) { 
    super(base);  // Call the constructor of the base class to inherit its properties and methods
  }

  ngOnInit(): void {
    // Call the method to load license types when the component is initialized
    this.loadLicenseTypes();
  }

  // Method to fetch license types from the backend service
  loadLicenseTypes(): void {
    this.siteAdminService.getLicenseTypes().subscribe(data => {
      this.licenseTypeDataSource.data = data;  // Set the data for the table's data source
    });
  }

  // Method to open the Edit dialog when the edit button is clicked
  onEdit(district: LicenseType): void {
    // Open the EditLicenseType dialog and pass the selected district data to it
    const dialogRef = this.dialog.open(EditLicensetypeComponent, {
      width: '400px',
      data: { ...district }  // Pass a copy of the district data to the dialog
    });

    // After the dialog is closed, reload the license types if the result is true
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLicenseTypes();  // Reload license types after update
      }
    });
  }

  // Method to delete a license type when the delete button is clicked
  onDelete(element: LicenseType): void {
    // Show a confirmation dialog before deletion using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the license type.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      // If the user confirms the deletion
      if (result.isConfirmed) {
        // Call the delete service to delete the license type by its ID
        this.siteAdminService.deleteLicenseType(element.id).subscribe(
          () => {
            // Show success message after successful deletion
            Swal.fire('Deleted!', 'The license type has been deleted.', 'success');
            // Refresh the table after deletion
            this.loadLicenseTypes();
            // Navigate back to the license type list
            this.router.navigate([`./site-admin/list-licensetype`]);
          },
          (error) => {
            // Handle error during deletion and show an error message
            console.error('Error deleting license type:', error);
            Swal.fire('Error!', 'There was a problem deleting the license type.', 'error');
          }
        );
      }
    });
  }
}
