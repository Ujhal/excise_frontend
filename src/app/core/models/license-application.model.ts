export class LicenseApplication {
  //select license
  exciseDistrict!: string;
  licenseCategory!: string;
  exciseSubDivision!: string;
  license!: string;

  //key info
  licenseType!: string;  
  establishmentName!: string;
  mobileNumber!: number;
  emailId!: string;
  licenseNo?: number;            //not required
  initialGrantDate?: string;     //not required
  renewedFrom?: string;          //not required
  validUpTo?: string;            //not required
  yearlyLicenseFee?: string;     //not required
  licenseNature!: string;
  functioningStatus!: string;
  modeofOperation!: string;  

  //address
  siteSubDivision!: string;
  policeStation!: string;
  locationCategory!: string;
  locationName!: string;
  wardName!: string;
  businessAddress!: string;
  roadName!: string;
  pinCode!: number;
  latitude?: string;            //not required
  longitude?: string;           //not required

  //unit details: only if licenseType = 'Company'
  companyName!: string;
  companyAddress!: string;
  companyPan!: string;
  companyCin!: string;
  incorporationDate!: string;
  companyPhoneNumber!: number;
  companyEmailId!: string;

  //member details
  status!: string;
  memberName!: string;
  fatherHusbandName!: string;
  nationality!: string;
  gender!: string;
  pan!: number;
  memberMobileNumber!: number;
  memberEmailId!: string;
}

//documents
export class LicenseApplicationDocuments {
  photo!: File;
}