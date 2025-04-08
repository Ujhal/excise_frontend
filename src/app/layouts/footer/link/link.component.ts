import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ContactUsService } from '../../../services/contact-us.service';
import { DirectorateAndDistrictOfficials, GrievanceRedressalOfficer, NodalOfficer, PublicInformationOfficer } from '../../../shared/models/contact-us.model';

export interface Commissioner {
  slNo: number;
  name: string;
  fromDate: string;
  toDate: string;
}
const COMMISSIONER_DATA: Commissioner[] = [
  {slNo: 1, name: 'Shri T. P. Sharma', fromDate: '26/09/1974', toDate: '19/03/1975'},
  {slNo: 2, name: 'Shri P. K. Pradhan, IAS', fromDate: '13/03/1975', toDate: '08/08/1977'},
  {slNo: 3, name: 'Shri R. B. Mukhia, IAS', fromDate: '09/08/1977', toDate: '23/05/1980'},
  {slNo: 4, name: 'Shri C. D. Rai, IAS', fromDate: '24/05/1980', toDate: '31/03/1983'},
  {slNo: 5, name: 'Shri R. Narayan, IAS', fromDate: '01/04/1983', toDate: '07/04/1985'},
];

@Component({
  selector: 'app-link',
  standalone:true,
  imports: [
    MaterialModule
  ],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss'
})
export class LinkComponent implements OnInit {
  contactsTab=0
  public pioTab: number = 0; // 0 = Headquarter, 1 = District

  nodalOfficer: NodalOfficer[] = [];

  directorateAndDistrictOfficialsColumns: string[] = ['id', 'name', 'designation', 'phoneNumber', 'email'];
  directorateAndDistrictOfficialsData = new MatTableDataSource<DirectorateAndDistrictOfficials>();

  grievanceRedressalOfficerColumns: string[] = ['id', 'officeLevel', 'officeSubLevel', 'name', 'designation', 'phoneNumber', 'email'];
  grievanceRedressalOfficerData = new MatTableDataSource<GrievanceRedressalOfficer>();

  headquarterColumns: string[] = ['headquarter', 'name', 'designation', 'address', 'phoneNumber'];
  headquarterData: PublicInformationOfficer[] = [];

  districtColumns: string[] = ['district', 'name', 'designation', 'address', 'phoneNumber'];
  districtData: PublicInformationOfficer[] = [];

  page: string | null= '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.page = params.get('page');
    });
    this.loadTableData();
  }

  constructor(private route: ActivatedRoute, private contactUsService: ContactUsService) {}

  commissionerColumns: string[] = ['slNo', 'name', 'fromDate', 'toDate'];
  commissionerData = COMMISSIONER_DATA;

  loadTableData(): void {
    this.contactUsService.getNodalOfficers().subscribe({
      next: (data) => {
        this.nodalOfficer = data;
      } 
    });

    this.contactUsService.getDirectorateAndDistrictOfficials().subscribe(data => {
      this.directorateAndDistrictOfficialsData.data = data;
    });

    this.contactUsService.getGrievanceRedressalOfficers().subscribe(data => {
      this.grievanceRedressalOfficerData.data = data;
    });

    this.contactUsService.getPublicInformationOfficers().subscribe({
      next: (officers: PublicInformationOfficer[]) => {
        this.headquarterData = officers.filter(o => o.locationType === 'Headquarter');
        this.districtData = officers.filter(o => o.locationType === 'District');
      },
      error: (err) => {
        console.error('Error fetching officers:', err);
      }
    });
  }

}
