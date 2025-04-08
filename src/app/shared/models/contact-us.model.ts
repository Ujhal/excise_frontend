export interface NodalOfficer {
    id?: number;
    department: string;         // default: "Excise Department"
    cell: string;               // default: "IT Cell"
    phoneNumber: string;       // default: "(035) 9220-3963"
    email: string;              // default: "helpdesk-excise@sikkim.gov.in"
  }
  
  export interface Official {
    id?: number;
    name: string;
    designation: string;
    phone_number: string;
    email: string;
  }
  
  export type OfficerLocationType = 'Headquarter' | 'District';
  
  export interface PublicInformationOfficer {
    id: number;
    locationType: OfficerLocationType; 
    location: string;           
    name: string;       
    designation: string;           
    address: string;              
    phoneNumber: string;              
    email?: string;             
  }
  
  export interface DirectorateAndDistrictOfficials{
    id?: number;
    name: string,
    designation: string,
    phoneNumber: string,
    email: string,
  }
  
  export type OfficeLevelType =
    | 'Head Quarter'
    | 'Permit Section'
    | 'Administration Section'
    | 'Accounts Section'
    | 'IT Cell';
  
  export interface GrievanceRedressalOfficer extends Official {
    officeLevel: OfficeLevelType;
    officeSubLevel?: string | null;
    name: string;
    designation: string;
    phoneNumber: string;
    email: string; 
  }
  