import { Component,OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../base/base.components';
import { BaseDependency } from '../../../base/dependency/base.dependendency';
import { District } from '../../../core/models/district.model';
import { SiteAdminService } from '../site-admin-service';
import { State } from '../../../core/models/state.model';
import { PatternConstants } from '../../../shared/constants/app.constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-district',
  imports: [MaterialModule, RouterModule],
  templateUrl: './add-district.component.html',
  styleUrl: './add-district.component.scss'
})
export class AddDistrictComponent extends BaseComponent implements OnInit {
  patternConstants = PatternConstants;
  states: State[] = [];
  state!: State;
  district!: District;

  constructor(base: BaseDependency,
    private siteAdminService: SiteAdminService,
    ) {
    super(base);
  }

  ngOnInit(): void {
    this.state= new State();
    this.state.stateCode=11;
    this.state.stateName='Sikkim';
    this.states[0]=this.state;
    this.district = new District();

    this.district.IsActive = true;
  }

  save(): void {
    console.log("Save button clicked!", this.district);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to add district with given details?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
    }).then((submit) => {
      if (submit.isConfirmed) {
        this.siteAdminService.saveDistrict(this.district).subscribe(res => {
          this.toastrService.success(res.message);
  
          Swal.fire({
            title: 'Success!',
            text: 'District has been added successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/site-admin/list-district']);
          });
  
        }, error => {
          console.error("Error saving district:", error);
          this.toastrService.error("Failed to save district.");
        });
      }
    });
  }
  
  
  cancel(): void {
    history.back();
   
  }
}
