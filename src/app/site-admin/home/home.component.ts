import { Component, OnInit, ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../base/base.components';
import { BaseDependency } from '../../base/dependency/base.dependendency';
import { Account } from '../../shared/models/accounts';
import { MaterialModule } from '../../material.module';
import { DashboardComponent } from "../dashboard/dashboard.component";
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-home',
  standalone: true, // Mark as standalone
  imports: [CommonModule, RouterModule, MaterialModule, DashboardComponent,MatSidenavModule], // Import necessary modules
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

  constructor(public baseDependancy: BaseDependency) {
    super(baseDependancy);
  }

  ngOnInit(): void {
    console.log('home called ')
    this.accountService.getAuthenticationState().subscribe(acc => {
      if (acc !== null) {
        this.user = acc;
        this.userName = this.user.first_name!;
        /*  if (this.user.middleName !== null) {
          this.userName = this.userName + ' ' + this.user.middleName;
        } */
        if (this.user.last_name !== null) {
          this.userName = this.userName + ' ' + this.user.last_name;
        }
      } else {
        this.router.navigate(['/']);
      }
      this.loaded = true;
    });
  }
  
  snavToggle(sidenav: any) {
    sidenav.toggle();
  }

}