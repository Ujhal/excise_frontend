import { Component, OnInit, ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../base/base.components';
import { BaseDependency } from '../../base/dependency/base.dependendency';
import { Account } from '../../shared/models/accounts';
import { MaterialModule } from '../../material.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-home',
  standalone: true, // Mark as standalone
  imports: [CommonModule, RouterModule, MaterialModule, MatMenuModule], // Import necessary modules
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends BaseComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) sidenav: any;
  account: any;
  user?: Account | null;
  subscription?: Subscription;
  loaded = false;
  userName!: string;

  constructor(public baseDependancy: BaseDependency, private dialog: MatDialog) {
    super(baseDependancy);
  }

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(acc => {
      if (acc !== null) {
        this.user = acc;
        this.userName = this.user.firstName!;
        /*  if (this.user.middleName !== null) {
          this.userName = this.userName + ' ' + this.user.middleName;
        } */
        if (this.user.lastName !== null) {
          
          this.userName = this.userName + ' ' + this.user.lastName;
        }
      } else {
        this.router.navigate(['/']);
      }
      this.loaded = true;
    });
  }
  
  isSidenavOpen = false;

  snavToggle(sidenav: any) {
    this.isSidenavOpen = !this.isSidenavOpen;
    sidenav.toggle();
  }

  viewProfile(): void {
    const dialogRef = this.dialog.open(UserProfileComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }

}