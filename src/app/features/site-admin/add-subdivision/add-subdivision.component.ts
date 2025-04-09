import { Component,OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../base/base.components';
import { BaseDependency } from '../../../base/dependency/base.dependendency';
import { District } from '../../../core/models/district.model';
import { SiteAdminService } from '../site-admin-service';
import { State } from '../../../core/models/state.model';
import { PatternConstants } from '../../../shared/constants/app.constants';
import { SubDivision } from '../../../core/models/subdivision.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-subdivision',
  imports: [MaterialModule,RouterModule],
  templateUrl: './add-subdivision.component.html',
  styleUrl: './add-subdivision.component.scss'
})
export class AddSubdivisionComponent  extends BaseComponent implements OnInit{
  patternConstants = PatternConstants;
  states: State[] = [];
  districts: District[] = [];
  state!: State;
  selectedDistrict!: District;
  subdivision!: SubDivision;

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
    this.subdivision = new SubDivision();
    
    this.siteAdminService.getDistrict().subscribe(res => {
      this.districts = res.filter((district: District) => district.IsActive === true);
    });
    this.subdivision.IsActive = true;
  }

  save(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to add subdivision with given details?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
    }).then((submit) => {
      if (submit.isConfirmed) {
        this.siteAdminService.saveSubDivision(this.subdivision).subscribe(res => {
          this.toastrService.success(res.message);
  
          // Success Swal alert
          Swal.fire({
            title: 'Success!',
            text: 'Subdivision has been added successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/site-admin/list-subdivision']);
          });
  
        }, error => {
          console.error("Error saving subdivision:", error);
          this.toastrService.error("Failed to save subdivision.");
        });
      }
    });
  }
  
  cancel(): void {
    history.back();
  }
}

