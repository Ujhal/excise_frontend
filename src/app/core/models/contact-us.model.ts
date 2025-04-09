export class Official {
  id!: number;
  name!: string;
  designation!: string;
  phoneNumber!: string;
  email!: string;
}

export class NodalOfficer extends Official{
  department!: string;       
  cell!: string;            
}
  
export type OfficerLocationType = 'Headquarter' | 'District';

export class PublicInformationOfficer extends Official{
  locationType!: OfficerLocationType; 
  location!: string;                   
  address!: string;                       
}

export class DirectorateAndDistrictOfficials extends Official{}

export type OfficeLevelType =
  | 'Head Quarter'
  | 'Permit Section'
  | 'Administration Section'
  | 'Accounts Section'
  | 'IT Cell';

export class GrievanceRedressalOfficer extends Official {
  officeLevel!: OfficeLevelType;
  officeSubLevel?: string | null;
}
  