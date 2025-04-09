import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LicenseType } from '../../../core/models/license-type.model';
import { SiteAdminService } from '../site-admin-service';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-add-licensetype',
  imports: [MaterialModule],
  templateUrl: './add-licensetype.component.html',
  styleUrl: './add-licensetype.component.scss'
})
export class AddLicensetypeComponent implements OnInit{
  licenseType: LicenseType = new LicenseType()

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
        this.siteAdminService.addLicenseType(this.licenseType).subscribe(
          (res) => {
            Swal.fire('Success', 'License Type added successfully!', 'success');
            this.router.navigate(['/site-admin/list-licensetype']);
          },
          (error) => {
            console.error('Error adding license type:', error);
            Swal.fire('Error', 'Failed to add License Type', 'error');
          }
        );
      }
    });
  }

  cancel(): void {
    history.back();
    
  }
}
