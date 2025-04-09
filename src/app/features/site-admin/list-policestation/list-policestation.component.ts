import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { RouterModule, Router } from '@angular/router';
import { BaseComponent } from '../../../base/base.components';
import { BaseDependency } from '../../../base/dependency/base.dependendency';
import { MatTableDataSource } from '@angular/material/table';
import { SiteAdminService } from '../site-admin-service';
import Swal from 'sweetalert2';
import { PoliceStation } from '../../../core/models/policestation.model';
import { SubDivision } from '../../../core/models/subdivision.model';
import { EditPolicestationComponent } from './edit-policestation/edit-policestation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-policestation',
  imports: [MaterialModule, RouterModule],
  templateUrl: './list-policestation.component.html',
  styleUrl: './list-policestation.component.scss'
})
export class ListPolicestationComponent extends BaseComponent implements OnInit{
  displayedColumns: string[] = ['id', 'policeStationName', 'policeStationCode', 'subDivisionCode', 'actions'];
  policeStationDataSource = new MatTableDataSource<PoliceStation>();
  subdivisions: SubDivision[] = [];
  allPoliceStations: PoliceStation[] = [];
  selectedSubDivisionCode: number | null = null;

  constructor(base: BaseDependency, private siteAdminService: SiteAdminService, private dialog: MatDialog) { 
    super(base); 
  }

  ngOnInit(): void {
    this.loadSubdivisions();
    this.loadPoliceStations();
  }

  loadSubdivisions(): void {
    this.siteAdminService.getSubDivision().subscribe(data => {
      this.subdivisions = data;
    });
  }

  loadPoliceStations(): void {
    this.siteAdminService.getPoliceStations().subscribe(data => {
      this.allPoliceStations = data;
      this.policeStationDataSource.data = this.allPoliceStations;
    });
  }

  onSubdivisionSelect(): void {
    if (this.selectedSubDivisionCode === null) {
      this.policeStationDataSource.data = this.allPoliceStations;
    } else {
      this.policeStationDataSource.data = this.allPoliceStations.filter(ps => ps.SubDivisionCode === this.selectedSubDivisionCode);
    }
  }

  onEdit(district: PoliceStation): void {
    const dialogRef = this.dialog.open(EditPolicestationComponent, {
      width: '400px',
      data: { ...district }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPoliceStations();
      }
    });
  }

  onDelete(element: PoliceStation): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this police station?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.siteAdminService.deletePoliceStation(element.id).subscribe(
          () => {
            this.allPoliceStations = this.allPoliceStations.filter(ps => ps.id !== element.id);
            this.policeStationDataSource.data = this.allPoliceStations;
            Swal.fire('Deleted!', 'The police station has been deleted.', 'success');
          },
          error => {
            console.error('Error deleting police station:', error);
            Swal.fire('Error!', 'An error occurred while deleting.', 'error');
          }
        );
      }
    });
  }
}
