import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../base/base.components';
import { BaseDependency } from '../../../base/dependency/base.dependendency';
import { District } from '../../../core/models/district.model';
import { SiteAdminService } from '../site-admin-service';
import { State } from '../../../core/models/state.model';
import { PatternConstants } from '../../../shared/constants/pattern.constants';
import { SubDivision } from '../../../core/models/subdivision.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-subdivision',
  imports: [MaterialModule, RouterModule],
  templateUrl: './add-subdivision.component.html',
  styleUrl: './add-subdivision.component.scss'
})
export class AddSubdivisionComponent extends BaseComponent implements OnInit {
  // Constants for pattern validation
  patternConstants = PatternConstants;
  // Arrays to store states and districts data
  states: State[] = [];
  districts: District[] = [];
  // Objects to store selected state, district, and subdivision data
  state!: State;
  selectedDistrict!: District;
  subdivision!: SubDivision;

  constructor(base: BaseDependency, private siteAdminService: SiteAdminService) {
    super(base); // Call to the base constructor
  }

  ngOnInit(): void {
    // Initializing state and subdivision objects
    this.state = new State();
    this.state.stateCode = 11;
    this.state.stateName = 'Sikkim';
    this.states[0] = this.state; // Adding the state to the states array
    this.subdivision = new SubDivision();
    
    // Fetch active districts from the service
    this.siteAdminService.getDistrict().subscribe(res => {
      // Filter out inactive districts
      this.districts = res.filter((district: District) => district.IsActive === true);
    });
    
    // Default value for IsActive in the subdivision
    this.subdivision.IsActive = true;
  }

  // Method to save the subdivision
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
        // Make a service call to save the subdivision
        this.siteAdminService.saveSubDivision(this.subdivision).subscribe(res => {
          // Show success message
          this.toastrService.success(res.message);

          // Success Swal alert
          Swal.fire({
            title: 'Success!',
            text: 'Subdivision has been added successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Redirect to the list of subdivisions after success
            this.router.navigate(['/site-admin/list-subdivision']);
          });

        }, error => {
          console.error("Error saving subdivision:", error);
          this.toastrService.error("Failed to save subdivision.");
        });
      }
    });
  }
  
  // Method to handle cancel action and go back
  cancel(): void {
    history.back();
  }
}
