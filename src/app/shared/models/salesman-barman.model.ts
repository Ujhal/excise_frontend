export class SalesmanBarman {
    //personal details
    id!: number;
    role!: string;
    firstName!: string;
    middleName!: string;
    lastName!: string;
    fatherHusbandName!: string;
    gender!: string;
    dob!: string;
    nationality!: string;
    address!: string;
    pan!: string;
    aadhaar!: number;
    mobileNumber!: number;
    emailId!: string;
    sikkimSubject!: boolean;

    //license details
    applicationYear!: string;
    applicationId!: string;
    applicationDate!: string;
    district!: string;
    licenseCategory!: string;
    license!: string;  
}
  
//documents
export interface SalesmanBarmanDocuments {
    passPhoto: string;
    aadhaarCard: string;
    residentialCertificate: string;
    dateofBirthProof: string;
}