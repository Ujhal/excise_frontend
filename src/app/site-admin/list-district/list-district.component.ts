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
  displayedColumns: string[] = ['slNo', 'id', 'district', 'districtCode', 'state', 'stateCode', 'actions'];
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

  onEdit(district: District): void {
    this.router.navigate(['/edit-district', district.id]);
  }
  
  onDelete(district: District): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete ${district.District}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.siteAdminService.deleteDistrict(district.id).subscribe(
          () => {
            Swal.fire('Deleted!', 'The district has been deleted.', 'success');
            this.loadDistricts(); // Refresh table
          },
          error => {
            Swal.fire('Error!', 'Failed to delete the district.', 'error');
            console.error('Error deleting district:', error);
          }
        );
      }
    });
  }

}
