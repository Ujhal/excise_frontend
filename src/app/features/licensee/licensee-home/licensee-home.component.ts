import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-licensee-home',
  imports: [ CommonModule, RouterModule, RouterOutlet, MaterialModule],
  templateUrl: './licensee-home.component.html',
  styleUrl: './licensee-home.component.scss'
})
export class LicenseeHomeComponent {
  loaded = true; 

  constructor(private dialog: MatDialog) {}
  
  userName = 'FirstName LN';
  snavToggle(sidenav: any) {
    sidenav.toggle();
  }

  viewProfile(): void {
    console.log('Button Clicked!');
    const dialogRef = this.dialog.open(UserProfileComponent, {
      width: '500px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }
  
}
