import { Component,OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../base/base.components';
import { BaseDependency } from '../../../base/dependency/base.dependendency';
import { MatTableDataSource } from '@angular/material/table';
import { District } from '../../../core/models/district.model';
import { SiteAdminService } from '../site-admin-service';
import { SubDivision } from '../../../core/models/subdivision.model';
import Swal from 'sweetalert2';
import { EditSubdivisionComponent } from './edit-subdivision/edit-subdivision.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-subdivision',
  imports: [MaterialModule,RouterModule],
  templateUrl: './list-subdivision.component.html',
  styleUrl: './list-subdivision.component.scss'
})
export class ListSubdivisionComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'subdivisionName', 'subdivisionNameLL', 'subdivisionCode', 'district', 'districtCode', 'actions'];
  subdivisionDataSource = new MatTableDataSource<SubDivision>();
  districts: District[] = [];
  allSubdivisions: SubDivision[] = [];
  selectedDistrictCode: number | null = null; // Initialize selectedDistrictCode

  constructor(base: BaseDependency, private siteAdminService: SiteAdminService, private dialog: MatDialog) { 
    super(base); 
  }

  ngOnInit(): void {
    this.loadDistricts(); // Load districts
    this.loadSubDivision();    // Load all subdivisions initially
  }

  loadDistricts(): void {
    this.siteAdminService.getDistrict().subscribe(data => {
      this.districts = data; // Load all districts
    });
  }

  loadSubDivision(): void {
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

  onEdit(district: District): void {
    const dialogRef = this.dialog.open(EditSubdivisionComponent, {
      width: '400px',
      data: { ...district }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSubDivision(); // Reload districts after update
      }
    });
  }

  onDelete(element: SubDivision): void {
      Swal.fire({
          title: 'Are you sure?',
          text: 'You will not be able to recover this subdivision!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel'
      }).then((result) => {
          if (result.isConfirmed) {
              this.siteAdminService.deleteSubdivision(element.id).subscribe(
                  () => {
                      Swal.fire('Deleted!', 'Subdivision has been deleted.', 'success');
                      this.loadSubDivision(); // Reload data
                  },
                  error => {
                      console.error('Error deleting subdivision:', error);
                      Swal.fire('Error!', 'Subdivision could not be deleted.', 'error');
                  }
              );
          }
      });
  }

}
