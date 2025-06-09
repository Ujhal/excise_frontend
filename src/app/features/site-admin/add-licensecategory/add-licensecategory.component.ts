import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LicenseCategory } from '../../../core/models/license-category.model';
import { SiteAdminService } from '../site-admin-service';
import Swal from 'sweetalert2';  // For confirmation and alert dialogs
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-add-licensecategory',
  imports: [MaterialModule],
  templateUrl: './add-licensecategory.component.html',
  styleUrl: './add-licensecategory.component.scss'
})
export class AddLicensecategoryComponent implements OnInit {

  // Model object to bind form data
  licenseCategory: LicenseCategory = new LicenseCategory();

  // Injecting necessary services like SiteAdminService and Router
  constructor(private siteAdminService: SiteAdminService, private router: Router) {}

  // Lifecycle hook - currently unused but required by interface
  ngOnInit(): void {}

  // Method to handle form submission
  save(): void {
    // Show confirmation dialog before proceeding
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to add this License Type?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      // If user confirms, send request to save the license category
      if (result.isConfirmed) {
        this.siteAdminService.addLicenseCategory(this.licenseCategory).subscribe(
          (res) => {
            // On success, show success dialog and navigate to list page
            Swal.fire('Success', 'License Category Added Successfully!', 'success');
            this.router.navigate(['/site-admin/list-licensecategory']);
          },
          (error) => {
            // On error, log and show error message
            console.error('Error adding license category:', error);
            Swal.fire('Error', 'Failed to add License Category', 'error');
          }
        );
      }
    });
  }

  // Method to go back to previous page
  cancel(): void {
    history.back();
  }
}
