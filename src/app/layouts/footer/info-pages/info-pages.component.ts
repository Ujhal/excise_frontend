import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { InfoPagesService } from '../../../core/services/info-pages.service';
import {
  DirectorateAndDistrictOfficials,
  GrievanceRedressalOfficer,
  NodalOfficer,
  PublicInformationOfficer
} from '../../../core/models/contact-us.model';

export interface Commissioner {
  slNo: number;
  name: string;
  fromDate: string;
  toDate: string;
}

const COMMISSIONER_DATA: Commissioner[] = [
  { slNo: 1, name: 'Shri T. P. Sharma', fromDate: '26/09/1974', toDate: '19/03/1975' },
  { slNo: 2, name: 'Shri P. K. Pradhan, IAS', fromDate: '13/03/1975', toDate: '08/08/1977' },
  { slNo: 3, name: 'Shri R. B. Mukhia, IAS', fromDate: '09/08/1977', toDate: '23/05/1980' },
  { slNo: 4, name: 'Shri C. D. Rai, IAS', fromDate: '24/05/1980', toDate: '31/03/1983' },
  { slNo: 5, name: 'Shri R. Narayan, IAS', fromDate: '01/04/1983', toDate: '07/04/1985' },
];

@Component({
  selector: 'app-info-pages',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './info-pages.component.html',
  styleUrl: './info-pages.component.scss'
})
export class InfoPagesComponent implements OnInit {
  contactsTab = 0;
  pioTab: number = 0;
  page: string | null = '';

  selectedOfficeLevel: string = '';
  selectedOfficeSubLevel: string = '';

  commissionerColumns: string[] = ['slNo', 'name', 'fromDate', 'toDate'];
  commissionerData = COMMISSIONER_DATA;

  nodalOfficer: NodalOfficer[] = [];

  directorateAndDistrictOfficialsColumns: string[] = ['id', 'name', 'designation', 'phoneNumber', 'email'];
  directorateAndDistrictOfficialsData = new MatTableDataSource<DirectorateAndDistrictOfficials>();

  grievanceRedressalOfficerColumns: string[] = [
    'id', 'officeLevel', 'officeSubLevel', 'name', 'designation', 'phoneNumber', 'email'
  ];
  grievanceRedressalOfficerFullData: GrievanceRedressalOfficer[] = [];
  grievanceRedressalOfficerData = new MatTableDataSource<GrievanceRedressalOfficer>();

  headquarterColumns: string[] = ['headquarter', 'name', 'designation', 'address', 'phoneNumber'];
  headquarterData: PublicInformationOfficer[] = [];

  districtColumns: string[] = ['district', 'name', 'designation', 'address', 'phoneNumber'];
  districtData: PublicInformationOfficer[] = [];

  constructor(private route: ActivatedRoute, private infoPagesService: InfoPagesService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.page = params.get('page');
    });
    this.loadTableData();
  }

  loadTableData(): void {
    this.infoPagesService.getNodalOfficers().subscribe({
      next: (data) => {
        this.nodalOfficer = data;
      }
    });

    this.infoPagesService.getDirectorateAndDistrictOfficials().subscribe(data => {
      this.directorateAndDistrictOfficialsData.data = data;
    });

    this.infoPagesService.getGrievanceRedressalOfficers().subscribe(data => {
      this.grievanceRedressalOfficerFullData = data;
      this.applyFilters(); // Initialize filtered data
    });

    this.infoPagesService.getPublicInformationOfficers().subscribe({
      next: (officers: PublicInformationOfficer[]) => {
        this.headquarterData = officers.filter(o => o.locationType === 'Headquarter');
        this.districtData = officers.filter(o => o.locationType === 'District');
      },
      error: (err) => {
        console.error('Error fetching officers:', err);
      }
    });
  }

  applyFilters(): void {
    this.grievanceRedressalOfficerData.data = this.grievanceRedressalOfficerFullData.filter(officer => {
      const matchesLevel = this.selectedOfficeLevel ? officer.officeLevel === this.selectedOfficeLevel : true;
      const matchesSubLevel = this.selectedOfficeSubLevel ? officer.officeSubLevel === this.selectedOfficeSubLevel : true;
      return matchesLevel && matchesSubLevel;
    });
  }
}
