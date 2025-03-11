import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SiteAdminService } from '../site-admin-service';
import Swal from 'sweetalert2';
import { PoliceStation } from '../../shared/models/policestation.model';
import { SubDivision } from '../../shared/models/subdivision.model';

@Component({
  selector: 'app-list-policestation',
  imports: [MaterialModule, RouterModule],
  templateUrl: './list-policestation.component.html',
  styleUrl: './list-policestation.component.scss'
})
export class ListPolicestationComponent implements OnInit{
  displayedColumns: string[] = ['slNo', 'policeStationName', 'policeStationCode', 'actions'];
  policeStationDataSource = new MatTableDataSource<PoliceStation>();
  subdivisions: SubDivision[] = [];
  allPoliceStations: PoliceStation[] = [];
  selectedSubDivisionCode: number | null = null;

  constructor(private siteAdminService: SiteAdminService) {}

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
