import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { ActivatedRoute } from '@angular/router';


export interface Headquarter {
  officerName: string;
  designation: string;
  address: string;
  phoneNumber: number;
}

export interface District {
  district: string;
  officerName: string;
  designation: string;
  address: string;
  phoneNumber: number;
}

export interface Directorate {
  name: string;
  designation: string;
  phoneNumber: string;
  email: string;
}

export interface Gro {
  officeLevel: string;
  officeSubLevel: string;
  name: string;
  designation: string;
  phoneNumber: string;
  email: string;
}

export interface Commissioner {
  slNo: number;
  name: string;
  fromDate: string;
  toDate: string;
}

const HEADQUARTER_DATA: Headquarter[] = [
  {officerName: 'Mrs. Samten Dolma Bhutia', designation: 'S.P.I.O.- Additional Secretary (Administration)', address: 'Excise Department , Mg Marg, Gangtok', phoneNumber: 3592203963},
  {officerName: 'Mr Namgyal Dorjee Bhutia', designation: 'A.P.I.O - Joint Commissioner(HQ)', address: 'Excise Department , Mg Marg, Gangtok', phoneNumber: 3592203963},
  {officerName: 'Mrs Sushma Pradhan', designation: 'A.P.I.O - Deputy Secretary (Adminstration)', address: 'Excise Department , Mg Marg, Gangtok', phoneNumber: 3592203963},
  {officerName: 'Mrs. Dil Maya Subba', designation: 'A.P.I.O - Sr. Accounts Officer (Accounts)', address: 'Excise Department , Mg Marg, Gangtok', phoneNumber: 3592203963},
  {officerName: 'Mr. Wangchuk Pakhrin', designation: 'A.P.I.O - Assistant Commissioner (Field)', address: 'Excise Department , Mg Marg, Gangtok', phoneNumber: 3592203963}
];

const DISTRICT_DATA: District[] = [
  {district: 'Namchi', officerName: 'Mr. Chewang Norbu Bhutia', designation: 'Deputy Commissioner', address: 'Excise Department, South Sikkim', phoneNumber: 3592203963},
  {district: 'Gyalshing', officerName: 'Mr. Bharat Bhandari', designation: 'A.P.I.O - Joint Commissioner (South/West)', address: 'Excise Department, Gyalshing', phoneNumber: 3592203963},
  {district: 'Namchi', officerName: 'Mr. Bharat Bhandari', designation: 'A.P.I.O - Deputy Commissioner ( South/West)', address: 'Excise Department, Namchi', phoneNumber: 3592203963},
  {district: 'Gangtok', officerName: 'Mr. Guru Prasad Dulal', designation: 'ASPIO-Deputy Commissioner(Pakyong)', address: 'Pakyong', phoneNumber: 3592203963},
  {district: 'Mangan', officerName: 'Mr. Chetnath Sharmaa', designation: 'ASPIO- Assistant Commissioner(Mangan)', address: 'Pakyong', phoneNumber: 3592203963},
];

const DIRECTORATE_DATA: Directorate[] = [
  {name: 'Mr. B.B Subba', designation: 'Secretary', phoneNumber: '(035) 9220-8678', email: 'excise.dept@sikkim.gov.in'},
  {name: 'Ms. Binita Chhetri, SES', designation: 'Commissioner', phoneNumber: '(035) 9220-3781', email: 'comm-excise@sikkim.gov.in'},
  {name: 'Ms. Samten Dolma Bhutia, SCS', designation: 'Additional Secretary', phoneNumber: '(035) 9220-3963', email: 'excise.dept@sikkim.gov.in'},
  {name: 'Ms. Samten Dolma Bhutia, SCS', designation: 'Joint Commissioner-HQ', phoneNumber: '(035) 9220-3963', email: 'dy.comm.j-excise@sikkim.gov.in'},
  {name: 'Ms. Karma Denkar Bhutia', designation: 'Sr. Private Secretary', phoneNumber: '(035) 9220-3963', email: 'excise.dept@sikkim.gov.in'},
];

const GRO_DATA: Gro[] = [
  {officeLevel: 'Excise Head Office', officeSubLevel: 'Head Quarter', name: 'Mrs. Binita Chhetri', designation: 'Commissioner', phoneNumber: '(035) 9220-3963', email: 'comm-excise@sikkim.gov.in'},
  {officeLevel: '', officeSubLevel: 'Permit Section', name: 'Namgyal Dorjee Bhutia', designation: 'Deputy Commissioner, HQ', phoneNumber: '(035) 9220-3963', email: 'dy.comm.j-excise@sikkim.gov.in'},
  {officeLevel: '', officeSubLevel: 'Administration Section', name: 'Mrs. Samten Dolma Bhutia', designation: 'Deputy Commissioner, HQ', phoneNumber: '(035) 9220-3963', email: 'samten.d@sikkim.gov.in'},
  {officeLevel: '', officeSubLevel: 'Accounts Section', name: 'Mrs Dil Maya Subba', designation: 'Accounts Officer', phoneNumber: '(035) 9220-3963', email: 'ao-excise@sikkim.gov.in'},
  {officeLevel: '', officeSubLevel: 'IT Cell', name: 'Karma Chewang Bhutia', designation: 'Programmer', phoneNumber: '(035) 9220-3963', email: 'progr-excise@sikkim.gov.in'},
];

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
  pioTab = 0

  page: string | null= '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.page = params.get('page');
    });
  }

  constructor(private route: ActivatedRoute) {}

  headquarterColumns: string[] = ['officerName', 'designation', 'address', 'phoneNumber'];
  headquarterData = HEADQUARTER_DATA;

  districtColumns: string[] = ['district', 'officerName', 'designation', 'address', 'phoneNumber'];
  districtData = DISTRICT_DATA;

  directorateColumns: string[] = ['name', 'designation', 'phoneNumber', 'email'];
  directorateData = DIRECTORATE_DATA;

  groColumns: string[] = ['officeLevel', 'officeSubLevel', 'name', 'designation', 'phoneNumber', 'email'];
  groData = GRO_DATA;

  commissionerColumns: string[] = ['slNo', 'name', 'fromDate', 'toDate'];
  commissionerData = COMMISSIONER_DATA;
  
}

