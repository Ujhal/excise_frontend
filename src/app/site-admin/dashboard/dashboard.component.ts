import { Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../base/base.components';
import { BaseDependency } from '../../base/dependency/base.dependendency';
import { Account } from '../../shared/models/accounts';
import { MaterialModule } from '../../material.module';
import { SiteAdminService } from '../site-admin-service';
import { Dashboard } from '../../shared/models/dashboard.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true, // Mark as standalone
  imports: [CommonModule,MaterialModule,RouterModule], // Import necessary modules
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends BaseComponent implements OnInit {
  siteAdminDashboard!: Dashboard;
  loaded=false;

  constructor(
    base: BaseDependency,
    private siteAdminService: SiteAdminService,
  ) {
    super(base);
  }

  ngOnInit(): void {
    console.log('iam called now ')
    this.siteAdminService.getAdminDashboard().subscribe(res => {
      console.log('Dashboard Data:', res); // Debugging
      this.siteAdminDashboard = res;
      this.loaded = true;
    });
  }
}