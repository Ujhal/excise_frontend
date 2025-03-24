export class Account {
    first_name!: string;
    middle_name!: string;
    last_name!: string;
    username!: string;
    phonenumber!: string;
    email!: string;
    password!: string;
    confirm_password?: string;
    role!: string;
    district!: string;  
    subDivision!: string;
    address!: string;
    created_by!: string;
    is_active!: boolean;
  }