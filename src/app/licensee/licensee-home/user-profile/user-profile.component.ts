import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  imports: [MaterialModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  loaded = true;

  user = {
    firstName: 'FirstName',
    lastName: 'LastName',
    username: 'firstnamelastname',
    email: 'firstnamelastname@example.com',
    phoneNumber: '123-456-7890',
    role: 'User',
    district: 'Gangtok',
    subDivision: 'Ranka',
    address: 'Down from the Left',
    createdBy: 'Admin'
  };

  constructor(public dialogRef: MatDialogRef<UserProfileComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
