import { Component,OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../base/base.components';
import { BaseDependency } from '../../base/dependency/base.dependendency';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { District } from '../../shared/models/district.model';
import { SiteAdminService } from '../site-admin-service';
import { SubDivision } from '../../shared/models/subdivision.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-subdivision',
  imports: [MaterialModule,RouterModule],
  templateUrl: './list-subdivision.component.html',
  styleUrl: './list-subdivision.component.scss'
})
export class ListSubdivisionComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['srno','SubdivisionName', 'SubdivisionCode', 'District', 'Active'];
  subdivisionDataSource = new MatTableDataSource<SubDivision>();
  districts: District[] = [];
  allSubdivisions: SubDivision[] = [];
  selectedDistrictCode: number | null = null; // Initialize selectedDistrictCode

  constructor(base: BaseDependency, private siteAdminService: SiteAdminService) {
    super(base);
  }

  ngOnInit(): void {
    this.loadDistricts(); // Load districts
    this.loadSubDiv();    // Load all subdivisions initially
  }

  loadDistricts(): void {
    this.siteAdminService.getDistrict().subscribe(data => {
      this.districts = data; // Load all districts
    });
  }

  loadSubDiv(): void {
    this.siteAdminService.getSubDivision().subscribe(data => {
      this.allSubdivisions = data; // Store all subdivisions
      this.subdivisionDataSource.data = this.allSubdivisions; // Show all initially
    });
  }

  onDistrictSelect(): void {
    if (this.selectedDistrictCode === null) { // Check for "All Districts"
      this.subdivisionDataSource.data = this.allSubdivisions; // Load all subdivisions
    } else {
      this.subdivisionDataSource.data = this.allSubdivisions.filter(sub => sub.DistrictCode === this.selectedDistrictCode);
    }
  }

  onToggleActive(event: MatSlideToggleChange, element: SubDivision): void {
    const initialStatus = element.IsActive; // Store the initial status
    const newStatus = event.checked;
  
    if (!newStatus) { // Show confirmation only if deactivating
      Swal.fire({
        title: 'Are you sure?',
        text: 'Are you sure you want to deactivate this item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, deactivate it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          // Confirm the new status and update in the backend
          this.updateActiveStatus(element, newStatus);
        } else {
          // Revert the toggle in the UI if canceled
          event.source.checked = initialStatus;
        }
      });
    } else {
      // Activate without confirmation
      this.updateActiveStatus(element, newStatus);
    }
  }
  
  // Separate method to handle the update logic
  updateActiveStatus(element: SubDivision, newStatus: boolean): void {
    element.IsActive = newStatus;
  
    this.siteAdminService.updateSubDivision(element.id, { IsActive: newStatus }).subscribe(
      response => {
        console.log('Updated subdivision:', response);
      },
      error => {
        console.error('Error updating subdivision:', error);
        // Optionally, revert toggle if there's an error
        element.IsActive = !newStatus;
      }
    );
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.subdivisionDataSource.filter = filterValue;
  }

}
