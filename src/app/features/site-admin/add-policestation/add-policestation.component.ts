import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../base/base.components';
import { BaseDependency } from '../../../base/dependency/base.dependendency';
import { SubDivision } from '../../../core/models/subdivision.model';
import { SiteAdminService } from '../site-admin-service';
import { PatternConstants } from '../../../shared/constants/app.constants';
import { PoliceStation } from '../../../core/models/policestation.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-policestation',
  imports: [MaterialModule, RouterModule],
  templateUrl: './add-policestation.component.html',
  styleUrl: './add-policestation.component.scss'
})
export class AddPolicestationComponent extends BaseComponent implements OnInit {
  patternConstants = PatternConstants;
  subdivisions: SubDivision[] = [];
  policeStation!: PoliceStation;

  constructor(
    base: BaseDependency,
    private siteAdminService: SiteAdminService
  ) {
    super(base);
  }

  ngOnInit(): void {
    this.policeStation = new PoliceStation();

    this.siteAdminService.getSubDivision().subscribe(res => {
      this.subdivisions = res;
    });
  }

  save(): void {
    this.myswal
      .fire({
        title: 'Are you sure?',
        text: 'You want to add a police station with given details?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
      })
      .then((submit: { isConfirmed: boolean }) => {
        if (submit.isConfirmed) {
          this.siteAdminService.addPoliceStation(this.policeStation).subscribe((res: any) => {
            this.toastrService.success(res.message);

            Swal.fire({
              title: 'Success!',
              text: 'Police Station has been added successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/site-admin/list-policestation']);
            });
    
          }, error => {
            console.error("Error saving police station:", error);
            this.toastrService.error("Failed to save police station.");
          });
        }
      });
    }
  

  cancel(): void {
    history.back();
    
    this.router.navigate(['/site-admin/list-policestation']);
  }
}