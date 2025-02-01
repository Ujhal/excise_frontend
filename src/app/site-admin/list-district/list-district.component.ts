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
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list-district',
  imports: [MaterialModule,RouterModule],
  templateUrl: './list-district.component.html',
  styleUrl: './list-district.component.scss'
})
export class ListDistrictComponent extends BaseComponent implements OnInit{
  displayedColumns: string[] = ['srno','District', 'DistrictCode', 'State', 'Active'];
  districtDataSource = new MatTableDataSource<District>();

  constructor(base: BaseDependency, private siteAdminService: SiteAdminService) { super(base) }

  ngOnInit(): void {
    this.loadDistricts();
  }

  loadDistricts(): void {
    this.siteAdminService.getDistrict().subscribe(data => {
      this.districtDataSource.data = data;
    });
  }

  // Handle the slider toggle for IsActive
  onToggleActive(event: MatSlideToggleChange, element: District): void {
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
  updateActiveStatus(element: District, newStatus: boolean): void {
    element.IsActive = newStatus;
  
    this.siteAdminService.updateDistrict(element.id, { IsActive: newStatus }).subscribe(
      response => {
        console.log('Updated District:', response);
      },
      error => {
        console.error('Error updating District:', error);
        // Optionally, revert toggle if there's an error
        element.IsActive = !newStatus;
      }
    );
  }
}
