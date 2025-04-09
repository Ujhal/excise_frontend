import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LicenseCategory } from '../../../core/models/license-category.model';
import { SiteAdminService } from '../site-admin-service';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-add-licensecategory',
  imports: [MaterialModule ],
  templateUrl: './add-licensecategory.component.html',
  styleUrl: './add-licensecategory.component.scss'
})
export class AddLicensecategoryComponent implements OnInit {
  licenseCategory: LicenseCategory = new LicenseCategory();

  constructor(private siteAdminService: SiteAdminService, private router: Router) {}

  ngOnInit(): void {}

  save(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to add this License Type?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.siteAdminService.addLicenseCategory(this.licenseCategory).subscribe(
          (res) => {
            Swal.fire('Success', 'License Category Added Successfully!', 'success');
            this.router.navigate(['/site-admin/list-licensecategory']);
          },
          (error) => {
            console.error('Error adding license category:', error);
            Swal.fire('Error', 'Failed to add License Category', 'error');
          }
        );
      }
    });
  }

  cancel(): void {
    history.back();
    
  }
}
